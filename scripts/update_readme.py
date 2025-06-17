import json
import re
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parents[1]
server_req = ROOT / 'server' / 'requirements.txt'
client_pkg = ROOT / 'client' / 'package.json'
readme = ROOT / 'README.md'

# Parse python requirements
py_deps = []
if server_req.exists():
    for line in server_req.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        name_ver = line
        m = re.match(r'([A-Za-z0-9_\-]+)(.*)', line)
        if m:
            name, ver = m.groups()
            ver = ver.strip()
            if ver.startswith('=='):
                pkg = f"{name}@{ver[2:]}"
            else:
                pkg = f"{name}{ver}"
        else:
            pkg = name_ver
        py_deps.append(pkg)

# Parse JS dependencies
js_deps = []
if client_pkg.exists():
    data = json.loads(client_pkg.read_text())
    for section in ('dependencies', 'devDependencies'):
        for name, ver in data.get(section, {}).items():
            js_deps.append(f"{name}@{ver}")

# Detect env vars
env_vars = set()
# from .env.example
env_example = ROOT / '.env.example'
if env_example.exists():
    for line in env_example.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            env_vars.add(line.split('=')[0])

# search Python files
for path in (ROOT / 'server').rglob('*.py'):
    if not path.is_file():
        continue
    text = path.read_text()
    env_vars.update(re.findall(r"os\.getenv\(['\"]([^'\"]+)['\"]", text))
    env_vars.update(re.findall(r"os\.environ\.get\(['\"]([^'\"]+)['\"]", text))

# search JS files
for path in (ROOT / 'client').rglob('*.js*'):
    if 'node_modules' in path.parts or not path.is_file():
        continue
    text = path.read_text()
    env_vars.update(re.findall(r"import\.meta\.env\.([A-Za-z0-9_]+)", text))
    env_vars.update(re.findall(r"process\.env\.([A-Za-z0-9_]+)", text))

dep_section = '## Dependencias instaladas\n' + '\n'.join(f'- {d}' for d in sorted(py_deps + js_deps)) + '\n'
vars_section = '## Variables de entorno\n' + '\n'.join(f'- {v}: ' for v in sorted(env_vars)) + '\n'
install_section = '## Instalacion\n```bash\npip install -r requirements.txt\nnpm install\n```\n'

content = readme.read_text()
for header in ('## Dependencias instaladas', '## Variables de entorno', '## Instalacion'):
    pattern = re.compile(header + r'.*?(?=\n## |\Z)', re.S)
    content = pattern.sub('', content)

content = content.rstrip() + '\n\n' + dep_section + '\n' + vars_section + '\n' + install_section
readme.write_text(content)
