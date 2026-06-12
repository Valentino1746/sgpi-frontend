# AGENTS.md - Contexto de Agente de Frontend (sgpi-frontend)

Este archivo proporciona el contexto y los estándares del proyecto de frontend para los agentes de desarrollo de IA.

## 1. Vista General y Arquitectura
- **Proyecto:** Frontend del Sistema Integral de Gestión de Proyectos de Investigación (SGPI) de la UNPA.
- **Pila Tecnológica:** Angular 20 (Standalone Components), TypeScript, RxJS, SCSS.


## 2. Estándares de Codificación y Diseño
- **Diseño Visual:** Seguir el sistema de diseño premium (HSL, glassmorphism, micro-animaciones) y layouts responsivos mobile-first. No usar estilos ad-hoc.
- **Patrones:** Uso de Observables y Signals para reactividad. Limpieza de suscripciones en `ngOnDestroy`.
- **SCSS:** Componentes con SCSS bien aislado y estructurado.
- **API Cliente:** Consumo de APIs REST utilizando interfaces TypeScript estrictamente tipadas que coincidan con los DTOs del backend.

## 3. Pruebas y QA
- **Pruebas Unitarias:** Jasmine/Karma para pruebas de componentes y servicios Angular.
- **Seguridad de Plantillas:** Siempre ejecutar `npm run build` localmente antes de proponer cambios para asegurar que el compilador estricto de Angular no detecte fallos de tipado.

## 4. Reglas de Git y Colaboración
- **Ramas:** Ramas de características `feature/us-X-descripcion` derivadas de `develop`.
- **Commits:** Uso de Conventional Commits y commits atómicos.
- **PRs:** Apuntar a `develop`. El agente `Pull Request Reviewer` evaluará el PR con comentarios inline de severidad (`[CRITICAL]`, `[MAJOR]`, `[MINOR]`).
