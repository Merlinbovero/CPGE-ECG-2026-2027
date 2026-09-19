#!/usr/bin/env python3
"""Reproduit les deux nuages de points de la fiche ANA 01-B1 en SVG."""
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'cours-prepa/assets/maths/2026-09-19-suites-b1'

def graph(filename, title, description, values, ymin, line=False):
    left, right, top, bottom = 64, 520, 62, 346
    x = lambda n: left + float(n) * (right-left) / 6
    y = lambda u: bottom - (float(u)-ymin) * (bottom-top) / (8-ymin)
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="560" height="400" viewBox="0 0 560 400" role="img" aria-labelledby="title desc"><title id="title">{title}</title><desc id="desc">{description}</desc>',
           '<rect width="560" height="400" fill="#fcfbf7" rx="8"/>',
           f'<text x="24" y="32" fill="#273d35" font-family="sans-serif" font-size="21" font-weight="600">{title}</text>']
    for n in range(7):
        svg.append(f'<path d="M{x(n):.3f} {top}V{bottom}" stroke="#dfdfd6"/>')
        svg.append(f'<text x="{x(n):.3f}" y="{y(0)+23:.3f}" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#34433b">{n}</text>')
    for u in range(ymin,9,2):
        svg.append(f'<path d="M{left} {y(u):.3f}H{right}" stroke="#dfdfd6"/>')
        if u:
            svg.append(f'<text x="{left-13}" y="{y(u)+5:.3f}" text-anchor="end" font-family="sans-serif" font-size="16" fill="#34433b">{u}</text>')
    svg.append(f'<path d="M{left} {top-7}V{bottom+3} M{left-4} {y(0):.3f}H{right+8}" stroke="#34433b" stroke-width="1.7" fill="none"/>')
    svg.append(f'<text x="{right+13}" y="{y(0)+5:.3f}" font-family="sans-serif" font-size="17" fill="#34433b">n</text>')
    svg.append(f'<text x="{left-23}" y="{top-13}" font-family="sans-serif" font-size="17" fill="#34433b">uₙ</text>')
    if line:
        svg.append(f'<path d="M{x(0):.3f} {y(-3):.3f}L{x(Fraction(11,2)):.3f} {y(8):.3f}" stroke="#769a86" stroke-width="2" stroke-dasharray="6 5"/>')
    for n,u in enumerate(values):
        px,py=x(n),y(u)
        svg.append(f'<path d="M{px-5:.3f} {py:.3f}H{px+5:.3f} M{px:.3f} {py-5:.3f}V{py+5:.3f}" stroke="#245a48" stroke-width="3" stroke-linecap="round"><title>n = {n} ; u = {u}</title></path>')
    svg.append('</svg>')
    (OUT/filename).write_text('\n'.join(svg)+'\n')

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    graph('arithmetique.svg','uₙ = −3 + 2n','Suite arithmétique de premier terme −3 et de raison 2. Les points sont alignés.',[-3+2*n for n in range(6)],-4,True)
    graph('geometrique.svg','uₙ = (3/2)ⁿ','Suite géométrique de premier terme 1 et de raison 3/2. Chaque valeur est multipliée par 3/2.',[Fraction(3,2)**n for n in range(6)],0)
    print('Deux graphiques B1 générés.')

if __name__ == '__main__':
    main()
