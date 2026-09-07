#!/usr/bin/env python3
"""Complète le manifeste avec toutes les pages HTML non redirigées (sans dépendance)."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
MARKER = '    /* BEGIN AUTO SEARCH — scripts/sync_search.py */'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.title = ''
        self.sections = []
        self.subject = None
        self.page_id = None
        self.redirect = False
        self.capture = None
        self.parts = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'body':
            self.subject = attrs.get('data-matiere') or attrs.get('data-prepa-subject')
            self.page_id = attrs.get('data-page-id')
        if tag == 'meta' and attrs.get('http-equiv', '').lower() == 'refresh':
            self.redirect = True
        if tag in ('title', 'h1', 'h2', 'h3'):
            self.capture = tag
            self.parts = []

    def handle_data(self, data):
        if self.capture:
            self.parts.append(data)

    def handle_endtag(self, tag):
        if tag == self.capture:
            value = ' '.join(''.join(self.parts).split())
            if tag == 'title':
                self.title = value
            elif value:
                self.sections.append(value)
            self.capture = None


def sync():
    target = ROOT / 'js/data.js'
    text = target.read_text()
    if MARKER in text:
        text = text.split(MARKER)[0].rstrip().rstrip(',') + '\n  ]\n};\n'
    known = set(re.findall(r'\bu:\s*"([^"]+)"', text))
    subjects = {'maths': 'maths', 'esh': 'esh', 'culture-generale': 'cg', 'anglais': 'anglais', 'italien': 'italien', 'methodologie': 'methodo'}
    entries = []
    for file in sorted(ROOT.rglob('*.html')):
        relative = file.relative_to(ROOT).as_posix()
        if relative in known or any(part.startswith('.') for part in file.relative_to(ROOT).parts):
            continue
        page = Page(file.read_text())
        if page.redirect:
            continue
        subject = page.subject or subjects.get(relative.split('/')[0], 'site')
        if subject not in (*subjects.values(), 'site'):
            subject = 'site'
        title = page.title
        if relative.startswith('cours-prepa/') and not title.startswith('Cours prépa'):
            title = 'Cours prépa — ' + title
        entries.append(dict(id=page.page_id or relative, m=subject, r=True, n='', t=title, u=relative, s=page.sections))
    end = text.rfind('\n  ]')
    addition = ',\n\n' + MARKER + '\n' + ',\n'.join('    ' + json.dumps(e, ensure_ascii=False) for e in entries)
    target.write_text(text[:end] + addition + text[end:])
    print(f'{len(entries)} pages complémentaires indexées.')

if __name__ == '__main__':
    sync()
