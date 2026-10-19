# 🎙️ Concurso de Oratoria — Entrenador de Declamación en Japonés

[![Angular](https://img.shields.io/badge/Angular-22.2-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![SSR](https://img.shields.io/badge/SSR-Express%205-black?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

Aplicación web interactiva de alto rendimiento desarrollada con **Angular 22** diseñada para el entrenamiento, memorización y perfeccionamiento de la pronunciación de textos y discursos en japonés orientados a concursos de oratoria.

---

## 📌 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Modos de Memorización](#-modos-de-memorización)
- [Pasajes Incluidos](#-pasajes-incluidos)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
- [Comandos Disponibles](#-comandos-disponibles)
- [Licencia](#-licencia)

---

## ✨ Características Principales

- 🗣️ **Lectura Asistida con Síntesis de Voz (Web Speech API):**
  - Detección y priorización automática de voces nativas en japonés (Google, Apple Siri, Microsoft Natural).
  - Velocidad de reproducción ajustable (desde 0.3x hasta 1.0x) para adaptarse al nivel del orador.
  - Reproducción continua o individual por cada frase con desplazamiento automático sincronizado (*auto-scroll*).

- 🎙️ **Grabación y Autoevaluación en Tiempo Real (MediaRecorder API):**
  - Grabación de voz oración por oración directamente desde el navegador.
  - Reproducción instantánea del audio grabado para comparar entonación, pausas y articulación frente al modelo.

- ⏱️ **Cronómetro de Declamación Integrado:**
  - Control de tiempo exacto para asegurar el cumplimiento de las restricciones de duración en competencias oficiales.

- 📖 **Espaciado Natural (*Wakachigaki* / 分かち書き):**
  - Opción de alternar entre escritura japonesa tradicional continua y texto segmentado por palabras y partículas gramaticales para facilitar la lectura fluida y el control de respiración.

- 🎥 **Video Modelo de Referencia:**
  - Integración de video modelo embebido con YouTube sin cookies (*youtube-nocookie*) para emular cadencia y expresión corporal.

- ⚡ **Diseño Limpio, Accesible y Responsivo:**
  - Estética refinada con tipografías optimizadas: *Zen Kaku Gothic New* para caracteres japoneses e *Inter* para la interfaz.

---

## 🧠 Modos de Memorización

La plataforma incluye un sistema de aprendizaje progresivo en 4 fases:

| Nivel | Modo | Descripción |
| :---: | :--- | :--- |
| **1** | **Completo** | Muestra el texto original en japonés junto con su pronunciación en **Rōmaji**. Ideal para una primera aproximación y lectura fonética. |
| **2** | **Sin Rōmaji** | Oculta la transcripción latina, obligando a asociar directamente la lectura con los caracteres en japonés (*Kana* y *Kanji*). |
| **3** | **Cloze (Huecos)** | Reemplaza palabras y partículas clave con espacios en blanco (`______`), estimulando la recuperación activa de la memoria. |
| **4** | **Ciego (Oculto)** | Oculta el texto por completo para simular la declamación real sobre el escenario de memoria absoluta. |

---

## 📚 Pasajes Incluidos

El sistema viene preconfigurado con una cuidada selección de lecturas y discursos:

1. **いきているって** (*Poema de sensaciones cotidianas y vida*) — 20 líneas.
2. **「わすれていること なあい」 (Parte 1)** (*Relato en la enfermería escolar sobre dar las gracias*) — 15 líneas.
3. **「わすれていること なあい」 (Parte 2)** (*Relato en el almuerzo escolar sobre pedir disculpas*) — 16 líneas.
4. **はなの みち** (*Cuento clásico del oso y el sendero de flores*) — 14 líneas 🎥 *(Incluye video modelo)*.
5. **かん字のはなし** (*Texto explicativo sobre el origen pictográfico de los kanji*) — 7 líneas.
6. **「雨の うた」** (*Poema rítmico sobre el sonido de la lluvia y la naturaleza*) — 18 líneas.

---

## 🛠️ Stack Tecnológico

- **Frontend Framework:** [Angular 22](https://angular.dev/) (Standalone Components, Signals reactivos, nuevo Control Flow de plantillas `@if` / `@for`).
- **Renderizado del Servidor (SSR):** Angular SSR integrado con [Express 5](https://expressjs.com/).
- **Lenguaje:** [TypeScript 6](https://www.typescriptlang.org/).
- **Testing:** [Vitest](https://vitest.dev/) y [JSDOM](https://github.com/jsdom/jsdom).
- **APIs del Navegador:**
  - `SpeechSynthesis` (Web Speech API) para TTS multilingüe.
  - `MediaRecorder` & `Audio` para captura y reproducción de voz.
- **Tipografía y Estilos:** Vanilla CSS con variables CSS personalizadas, fuentes Google Fonts (*Zen Kaku Gothic New* & *Inter*).

---

## 📂 Estructura del Proyecto

```text
Oratoria/
├── public/                 # Recursos públicos y estáticos
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/            # Barra superior de navegación y logotipo
│   │   │   ├── passage-list/      # Cuadrícula de selección de pasajes
│   │   │   └── practice-view/     # Mesa de trabajo y entrenamiento interactivo
│   │   ├── data/
│   │   │   └── passages.data.ts   # Base de datos local de pasajes y textos
│   │   ├── models/
│   │   │   └── passage.model.ts   # Definición de interfaces TypeScript
│   │   ├── services/
│   │   │   ├── audio-recorder.service.ts # Grabación y gestión de audio local
│   │   │   ├── passage.service.ts        # Proveedor de catálogo de pasajes
│   │   │   ├── speech.service.ts         # Motor de síntesis de voz en japonés
│   │   │   └── timer.service.ts          # Cronómetro de práctica
│   │   ├── app.config.ts          # Configuración de proveedores cliente
│   │   ├── app.config.server.ts   # Configuración de proveedores SSR
│   │   └── app.routes.ts          # Definición de rutas principales
│   ├── index.html                 # HTML principal y metadatos
│   ├── main.ts                    # Punto de entrada de la aplicación cliente
│   ├── server.ts                  # Servidor Express para SSR
│   └── styles.css                 # Tokens globales y estilos base
├── angular.json                   # Configuración del CLI de Angular
├── package.json                   # Dependencias y scripts
└── tsconfig.json                  # Configuración de TypeScript
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos

- **Node.js** (versión 20.x o superior recomendada)
- **npm** (versión 10.x o superior)

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/dfv0624/Oratoria.git
   cd Oratoria
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm start
   # o bien: ng serve
   ```

4. **Abrir en el navegador:**
   Visita `http://localhost:4200` para comenzar a practicar.

---

## 💻 Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm start` | Inicia el servidor de desarrollo en `http://localhost:4200` con recarga en vivo. |
| `npm run build` | Compila la aplicación y genera los artefactos optimizados en la carpeta `dist/`. |
| `npm test` | Ejecuta las pruebas unitarias utilizando **Vitest**. |
| `npm run serve:ssr:Oratoria` | Inicia el servidor de producción con renderizado del lado del servidor (SSR). |

---

## 📄 Licencia

Este proyecto es de uso libre con fines educativos y de práctica personal.
