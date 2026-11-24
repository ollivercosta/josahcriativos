"""Separa regras CSS com seletores agrupados de classes diferentes.

Princípio (o mesmo do sistema): cada classe tem a sua própria regra, para que
mudar uma não mude outra sem querer. Uma regra como
    .a, .b { margin: 0 }
vira
    .a { margin: 0 }
    .b { margin: 0 }
Seletores da mesma classe base (.a:hover, .a:focus-visible) continuam juntos.
Uso: python3 ferramentas/separar_seletores.py assets/css/*.css
"""
import re
import sys

REGRA = re.compile(r"^([ ]*)((?:[^{}\n]+,\n\1)+[^{}\n]+) \{\n(.*?)\n\1\}", re.M | re.S)


def base(seletor):
    """A primeira classe do seletor: a 'dona' da regra."""
    m = re.search(r"\.([A-Za-z0-9_-]+)", seletor)
    return m.group(1) if m else seletor.strip()


def separar(texto):
    def trocar(m):
        recuo, seletores, corpo = m.group(1), m.group(2), m.group(3)
        lista = [s.strip() for s in seletores.split(",")]
        grupos = {}
        for s in lista:
            grupos.setdefault(base(s), []).append(s)
        if len(grupos) < 2:
            return m.group(0)
        blocos = []
        for itens in grupos.values():
            cabeca = (",\n" + recuo).join(itens)
            blocos.append(f"{recuo}{cabeca} {{\n{corpo}\n{recuo}}}")
        return "\n\n".join(blocos)

    return REGRA.sub(trocar, texto)


if __name__ == "__main__":
    for caminho in sys.argv[1:]:
        texto = open(caminho, encoding="utf-8").read()
        novo = separar(texto)
        if novo != texto:
            open(caminho, "w", encoding="utf-8").write(novo)
            print("separado:", caminho)
