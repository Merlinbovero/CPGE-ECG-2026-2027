#!/usr/bin/env python3
"""Contrôle du site statique avant publication ; Python + Node, sans dépendance."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.ids, self.refs, self.scripts = [], [], []
        self.script = None
        self.redirect = False
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        self.refs.extend(attrs[key] for key in ('href', 'src') if attrs.get(key))
        if tag == 'meta' and attrs.get('http-equiv', '').lower() == 'refresh':
            self.redirect = True
        if tag == 'script' and not attrs.get('src') and attrs.get('type', '') not in ('application/json', 'application/ld+json'):
            self.script = ''

    def handle_data(self, data):
        if self.script is not None:
            self.script += data

    def handle_endtag(self, tag):
        if tag == 'script' and self.script is not None:
            self.scripts.append(self.script)
            self.script = None


def validate():
    pages = {p: Page(p) for p in ROOT.rglob('*.html') if not any(x.startswith('.') for x in p.relative_to(ROOT).parts)}
    errors = []
    refs = 0

    def reference(file, raw):
        nonlocal refs
        url = urlsplit(raw)
        if url.scheme or url.netloc:
            return
        refs += 1
        target = (file.parent / unquote(url.path)).resolve() if url.path else file
        if target.is_dir():
            target = target / 'index.html'
        if not target.exists():
            errors.append(f'{file.relative_to(ROOT)} : fichier absent : {raw}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'{file.relative_to(ROOT)} : ancre absente : {raw}')

    def javascript(name, code):
        result = subprocess.run(['node', '--check'], input=code, text=True, capture_output=True)
        if result.returncode:
            errors.append(f'{name} : JavaScript invalide\n{result.stderr}')

    for file, page in pages.items():
        for key, count in Counter(page.ids).items():
            if count > 1:
                errors.append(f'{file.relative_to(ROOT)} : id dupliqué : {key}')
        for raw in page.refs:
            reference(file, raw)
        for index, code in enumerate(page.scripts):
            javascript(f'{file.relative_to(ROOT)} script {index + 1}', code)
    for file in (ROOT / 'css').glob('*.css'):
        for raw in re.findall(r'url\([\"\']?([^\)\"\']+)', file.read_text()):
            reference(file, raw)
    for file in [*(ROOT / 'js').glob('*.js'), ROOT / 'sw.js']:
        javascript(file.relative_to(ROOT), file.read_text())

    code = (ROOT / 'js/data.js').read_text() + '\nconsole.log(JSON.stringify(SITE_DATA));'
    result = subprocess.run(['node'], input=code, text=True, capture_output=True, check=True)
    data = json.loads(result.stdout)
    seen = set()
    for page in data['pages']:
        if page['u'] in seen:
            errors.append('Recherche : doublon : ' + page['u'])
        seen.add(page['u'])
        if page['m'] not in data['matieres']:
            errors.append('Recherche : matière inconnue : ' + page['m'])
        reference(ROOT / 'index.html', page['u'])
    for file, page in pages.items():
        if not page.redirect and file.relative_to(ROOT).as_posix() not in seen:
            errors.append('Recherche : page non indexée : ' + file.relative_to(ROOT).as_posix())

    archive_code = 'var window = {};\n' + (ROOT / 'js/cours-prepa-data.js').read_text() + '\nconsole.log(JSON.stringify(window.PREPA_ARCHIVE));'
    archive = json.loads(subprocess.run(['node'], input=archive_code, text=True, capture_output=True, check=True).stdout)
    for course in archive['courses']:
        for key in ('url', 'thumb', 'chapterUrl'):
            reference(ROOT / 'index.html', course[key])
    print(f'{len(pages)} pages, {refs} références locales, {len(seen)} pages indexées, {len(errors)} erreur(s).')
    for error in errors:
        print(error)
    return bool(errors)

if __name__ == '__main__':
    sys.exit(validate())
