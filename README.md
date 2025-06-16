# Optimización de Puestos

Plantilla inicial para un proyecto full-stack con FastAPI y React.

## Desarrollo

```bash
# Backend
cd server
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn server.main:app --reload

# Frontend
cd ../client
npm install
npm run dev
```

Pruebas se ejecutan con `pytest` para el back-end y `npm test` para el front-end.

## Rediseño Tailwind only

La interfaz se rehízo utilizando exclusivamente utilidades de Tailwind CSS siguiendo un diseño pixel-perfect. Principales características:

- **Colores de marca**: Se configuraron colores personalizados para la marca (`brand-blue`, `brand-mint`, `brand-lightmint`)
- **Tipografía**: Se integró la fuente Inter como fuente principal
- **Componentes**: Se rediseñaron todos los componentes usando únicamente utilidades de Tailwind:
  - Contenedor principal con sombras y bordes redondeados
  - Botones con estados hover y disabled
  - Preview de JSON con gradiente y línea numérica
  - Inputs con estados focus y placeholders
  - Iconos de Lucide React para mejorar la UX
- **Responsive**: Se mantuvieron las proporciones en todos los breakpoints

El rediseño se logró sin CSS externo, utilizando únicamente las capacidades de Tailwind CSS a través de la configuración `tailwind.config.js` y clases utilitarias.
