# Asignación de Puestos de Trabajo para una Estrategia Híbrida

¡Bienvenido al repositorio de **Asignación de Puestos de Trabajo para una Estrategia Híbrida**!

Este proyecto surge como respuesta a la necesidad de modernizar y optimizar la asignación de espacios de trabajo, evitando procesos manuales que consumen tiempo y dificultan la adaptación a cambios imprevistos, como ausencias o modificaciones en los equipos.

---

## 📜 Contexto del Problema

Actualmente, la asignación de espacios se realiza de forma manual, lo que consume tiempo valioso y dificulta la respuesta ante cambios inesperados. Tras la pandemia, la estrategia se modernizó y se adoptó un enfoque híbrido que combina la presencialidad y el teletrabajo.

**Reto:**  
Optimizar, de forma equitativa y eficiente, la asignación de puestos de trabajo según el calendario de asistencia. Los puntos clave son:

- **Un día de reunión presencial semanal para cada equipo.**
- **Asistencia de cada colaborador 2‑3 días a la semana, según sus preferencias.**
- **Respeto a perfiles que determinan qué puestos puede ocupar cada persona** (ej. perfiles de software, ergonomía, etc.).
- **Organización de escritorios agrupados en zonas dentro del edificio.**

### Información de Entrada

- **Employees:** Listado de IDs de empleados, por ejemplo: `["E0","E1",…]`.
- **Desks:** Listado de escritorios, por ejemplo: `["D0","D1",…]`.
- **Days:** Días de la semana: `["L","Ma","Mi","J","V"]`.
- **Groups:** Listado de grupos, por ejemplo: `["G0","G1",…]`.
- **Zones:** Listado de zonas, por ejemplo: `["Z0","Z1"]`.
- **Desks_Z, Desks_E, Employees_G, Days_E:** Diccionarios que relacionan zonas, escritorios y la disponibilidad de cada empleado o grupo.
- **Parámetros de negocio y pesos:** `min_attendance`, `W_extra`, `W_notpref`, `W_iso`, `W_change`

---

## 🖥️ Guía de Uso en Deepnote

Para utilizar esta aplicación en **Deepnote**, sigue estos pasos:

1. **Accede a la aplicación web:**  
   [Deepnote - Challenge](https://deepnote.com/app/nesan21/Challenge-8dc4282f-9718-4e9c-973c-abdb64a26289)

2. **Sube el archivo JSON:**  
   Arrastra tu archivo JSON con la información que deseas optimizar al panel izquierdo.

3. **Ejecución Automática del Modelo:**  
   El modelo arranca automáticamente; confirma que el botón “Run” cambie de **Run** a **Stop**.  
   Si no es así, haz clic para iniciar la optimización.  
   ![gif-run](https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif)

4. **Visualiza los Resultados:**  
   Al finalizar, aparecerá un enlace para “Ver los Resultados”, el cual mostrará:
   - Porcentaje de ocupación de puestos.
   - Porcentaje de empleados que mantienen el mismo escritorio.
   - Porcentaje de empleados no aislados durante la reunión.
   - Porcentaje de cumplimiento de preferencias de días.

5. **Interactividad:**  
   Puedes filtrar los resultados por día, zona, escritorio o empleado, además de poder descargarlos en formato Excel.

Para más detalles, visita la [documentación oficial de Deepnote](https://docs.deepnote.com/).

---

## 📦 Ejecutar el Proyecto Localmente

Para trabajar en este proyecto en tu entorno local, sigue estos pasos:

### Configuración del Back-end

1. **Clona el Repositorio**

   ```bash
   git clone https://github.com/nestortada/AppOpti.git
   ```

2. **Accede al Directorio del Servidor**

   ```bash
   cd AppOpti/server
   ```

3. **Activa el Entorno Virtual**

   En Windows:

   ```bash
   .venv/Scripts/activate
   ```

   En Linux/Mac (si aplica):

   ```bash
   source .venv/bin/activate
   ```

4. **Instala las Dependencias**

   Asegúrate de tener un archivo `requirements.txt` actualizado y ejecuta:

   ```bash
   pip install -r requirements.txt
   ```

5. **Configuración de Variables de Entorno para el Back-end**

   Crea un archivo `.env` en el directorio `server` con la siguiente variable:

   - `GOOGLE_APPLICATION_CREDENTIALS_BASE64`: Credenciales codificadas en base64 para acceder a Firebase o el servicio requerido.

6. **Inicia el Servidor Back-end**

   Ejecuta el siguiente comando para iniciar la aplicación utilizando Uvicorn:

   ```bash
   python -m uvicorn main:app --reload
   ```

### Configuración del Front-end

1. **Accede al Directorio del Cliente**

   En una nueva terminal, desde la raíz del repositorio, ejecuta:

   ```bash
   cd AppOpti/client
   ```

2. **Instala las Dependencias**

   Ejecuta el siguiente comando:

   ```bash
   npm i
   ```

3. **Configuración de Variables de Entorno para el Front-end**

   Crea un archivo `.env` en el directorio `client` con las siguientes variables:

   - `VITE_API_URL`: URL del API (proporcionada por el back-end).
   - `VITE_FIREBASE_CONFIG`: Configuración para conectar con Firebase.

4. **Inicia el Servidor Front-end**

   Ejecuta:

   ```bash
   npm run dev
   ```

---

## 🔍 Explicación de la Solución y Visualización de Resultados

### Explicación de la Solución:
1. **Lectura de JSON y Variables de Entorno:**  
   - Se carga la información proporcionada en el archivo JSON de entrada.
   - Se utilizan variables de entorno para configurar parámetros críticos y conectarse a servicios externos, como Firebase.

2. **Construcción del Modelo con PuLP:**
   - Se definen las variables de decisión (ej. `X_edt`, `U_ed`, `M_gt`, `N_gzt`, `Solo_gzt`).
   - Se formula la función objetivo que maximiza los días extra y penaliza incumplimientos en preferencias, aislamientos y cambios de escritorio.
   - Se resuelve el problema de optimización usando PuLP.

3. **Persistencia de Resultados:**
   - Los resultados se guardan en Firebase para un acceso rápido y centralizado.

4. **Generación de la Página Web de Resultados:**
   - Se construye una interfaz web para mostrar métricas clave como:
     - **Ocupación de puestos**
     - **Mantenimiento de escritorio**
     - **Aislamiento mínimo**
     - **Cumplimiento de preferencias**
   - Cada una de estas secciones se ilustra con gifs y emojis para facilitar la interpretación de la información.
   - Por ejemplo, la sección de ocupación puede mostrar un gráfico de porcentaje de ocupación, mientras que la sección de mantenimiento de escritorio mostrará estadísticas sobre cuántos empleados conservaron su escritorio asignado.
   - Se ofrecen filtros interactivos por día, zona, escritorio o empleado, permitiendo una visualización personalizada y la opción de descargar los datos en Excel.
 
   ![gif-check](https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif)

---

## 🤖 Extras para Hacerlo Entretenido

- ✔️ **Optimización en tiempo real:** Observa de inmediato los cambios y resultados.
- 🚀 **Interactividad:** Filtrado dinámico por día, zona, escritorio o empleado.
- ✔️ **Documentación de Referencia:**  
  - [Deepnote Documentation](https://docs.deepnote.com/)
  - [PuLP Documentation](https://coin-or.github.io/pulp/)
  - [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin)

Utiliza estos enlaces para profundizar en la configuración y uso de cada componente. ¡Disfruta del proyecto y contribuye a mejorarlo!

---
