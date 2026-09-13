#!/usr/bin/env python3
"""Tracé de la récurrence de l'exercice 6 ; aucune approximation dans le corrigé."""
from pathlib import Path
from math import sqrt
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

DEST = Path(__file__).resolve().parents[1] / "cours-prepa/assets/maths/2026-09-13-td-suites-ana01a"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 14, "svg.fonttype": "none"})
u = [4.0]
for _ in range(4):
    u.append(sqrt(3 * u[-1] - 2))

fig, ax = plt.subplots(figsize=(9.6, 8.4), facecolor="white")
fig.subplots_adjust(left=.09, right=.95, bottom=.11, top=.91)
x = np.linspace(2/3, 5, 800)
ax.plot(x, np.sqrt(3*x-2), color="#b34f17", lw=2.6, label=r"$y=\sqrt{3x-2}$")
ax.plot([0, 5], [0, 5], color="#56616c", lw=1.6, ls="--", label=r"$y=x$")
px, py = [u[0]], [0]
for i in range(4):
    px.extend([u[i], u[i+1]])
    py.extend([u[i+1], u[i+1]])
ax.plot(px, py, color="#1758a5", lw=2.1, label="Construction de $u_0$ à $u_4$")
ax.scatter(u[:-1], u[1:], s=35, color="#1758a5", zorder=5)
ax.scatter([u[0]], [0], s=45, color="#1758a5", zorder=6, clip_on=False)
ax.annotate(r"$u_0=4$", xy=(4, 0), xytext=(4.23, .27), color="#1758a5",
            arrowprops={"arrowstyle": "-", "color": "#1758a5"}, fontsize=14)
ax.annotate(r"$(u_0,u_1)$", xy=(u[0], u[1]), xytext=(4.13, 3.15), fontsize=12, color="#1758a5")
ax.annotate(r"$(u_1,u_2)$", xy=(u[1], u[2]), xytext=(3.43, 2.47), fontsize=12,
            arrowprops={"arrowstyle": "-", "color": "#1758a5"}, color="#1758a5")
ax.annotate(r"$(u_2,u_3)$", xy=(u[2], u[3]), xytext=(2.78, 1.95), fontsize=12,
            arrowprops={"arrowstyle": "-", "color": "#1758a5"}, color="#1758a5")
ax.annotate(r"$(u_3,u_4)$", xy=(u[3], u[4]), xytext=(1.03, 2.92), fontsize=12,
            arrowprops={"arrowstyle": "-", "color": "#1758a5"}, color="#1758a5")
ax.scatter([1, 2], [1, 2], color="#1f2937", s=28, zorder=5)
ax.annotate("Point fixe (2, 2)", xy=(2, 2), xytext=(.35, 1.55), fontsize=12,
            arrowprops={"arrowstyle": "-", "color": "#56616c"}, color="#1f2937")
ax.set(xlim=(0, 5), ylim=(0, 5), xlabel="$x$", ylabel="$y$")
ax.set_aspect("equal", adjustable="box")
ax.set_xticks(range(6))
ax.set_yticks(range(6))
ax.grid(alpha=.2)
for s in ["top", "right"]:
    ax.spines[s].set_visible(False)
ax.set_title("Exercice 6 · Construction des cinq premiers termes", fontsize=17, pad=18)
ax.legend(loc="upper left", frameon=False, fontsize=13)
fig.savefig(DEST / "escalier.svg")
fig.savefig(DEST / "escalier.png", dpi=100)
plt.close(fig)
