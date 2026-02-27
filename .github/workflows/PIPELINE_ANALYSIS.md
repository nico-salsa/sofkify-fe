# 🔍 Análisis de Pipeline CI/CD - Sofkify Frontend

**Fecha:** 26 de febrero de 2026  
**Rol:** DevOps Senior  
**Objetivo:** Documentar la estrategia de CI/CD para el frontend

---

## 📋 Contexto Identificado

### Características del Proyecto Frontend
```
Tecnología:
  ✅ Build Tool: npm / vite
  ✅ Lenguaje: TypeScript + React 19.2.0
  ✅ Test Framework: Vitest 4.0.18
  ✅ Testing Library: @testing-library/react

Testing:
  ❌ Tests NO implementados aún (se crean en Taller 2)
  ✅ Infraestructura de testing lista (vitest.config.ts)
```

### Configuración Detectada en vitest.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
});
```

### Dependencias de Testing
```json
{
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/react": "^16.3.2",
  "@testing-library/user-event": "^14.6.1",
  "jsdom": "^28.1.0",
  "vitest": "^4.0.18"
}
```

---

## 🎯 Reglas de Negocio del Pipeline

### Trigger (Cuándo se ejecuta)
```yaml
Ramas permitidas: main, develop, feature/**
Eventos:
  - Push a cualquiera de las ramas
  - Pull Request hacia cualquiera de las ramas
```

### Requisitos de Éxito
```
✅ TODOS los tests deben pasar
✅ Cobertura de código mínima: 70%
✅ Linting debe pasar (ESLint)
❌ Fallar si alguna prueba no pasa
❌ Fallar si cobertura < 70%
❌ Fallar si hay errores de linting
```

---

## ⚙️ Estrategia de Ejecución

### Flujo del Pipeline
```
1. Checkout del código
   └─ Descargar repositorio en el runner

2. Configurar Node.js
   ├─ Versión: 20.x (LTS recomendada)
   └─ npm: versión automática

3. Cache de npm
   └─ Reutilizar node_modules descargados

4. Instalar Dependencias
   └─ npm ci (instalación reproducible)

5. Ejecutar Linting
   └─ npm run lint (ESLint)
   └─ Fallar si hay errores

6. Ejecutar Tests con Cobertura
   ├─ npm run test:coverage (comando a crear)
   └─ Vitest genera reporte de cobertura

7. Validar Cobertura Mínima
   └─ Fallar si cobertura < 70%

8. Guardar Artefactos
   └─ Reportes de cobertura y tests
```

---

## 🔧 Configuraciones Necesarias

### 1. Agregar Script en package.json

**Agregar a la sección `scripts`:**
```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

**Por qué:**
- `test`: Modo interactivo para desarrollo (no lo usamos en CI)
- `test:coverage`: Modo de ejecución única con reporte de cobertura (ideal para CI)

### 2. Configuración de Cobertura en vitest.config.ts

La configuración debe incluir:
```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',  // Provider de cobertura
      reporter: ['text', 'html', 'json', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts'
      ],
      lines: 70,       // Mínimo de líneas cubiertas
      functions: 70,   // Mínimo de funciones cubiertas
      branches: 70,    // Mínimo de branches cubiertos
      statements: 70   // Mínimo de statements cubiertos
    }
  }
});
```

---

## 📊 Estructura del Pipeline YAML

```yaml
name: CI Pipeline Frontend
on:
  push:
    branches: [main, develop, 'feature/**']
  pull_request:
    branches: [main, develop, 'feature/**']

jobs:
  test-and-coverage:
    runs-on: ubuntu-latest
    steps:
      1. Checkout
      2. Setup Node.js
      3. Cache npm
      4. Install dependencies
      5. Run linting
      6. Run tests with coverage
      7. Upload coverage report
      8. Validate coverage >= 70%
```

---

## 🚦 Estados del Pipeline

```
✅ SUCCESS
   ├─ Todos los tests pasaron
   ├─ Linting sin errores
   ├─ Cobertura >= 70%
   └─ PR puede ser mergeado

⚠️ WARNING
   └─ Tests/Linting pasaron pero cobertura < 70%
   └─ Recomendación: Agregar más tests

❌ FAILURE
   ├─ Al menos 1 test falló
   ├─ Linting falló (errores de ESLint)
   ├─ Cobertura < 70%
   └─ Bloquea la integración (merge bloqueado)
```

---

## 📈 Esperado en Producción

Una vez que se implementen los tests en Taller 2:

```
Por cada Push/PR:
├─ Checkout: ~10 seg
├─ Setup Node + Cache: ~30 seg
├─ Install dependencies: ~60-90 seg (primer run) / ~10 seg (con cache)
├─ Linting: ~20 seg
├─ Tests + Coverage: ~60-120 seg
└─ Total: ~3-5 minutos
```

---

## 🔐 Mecanismos de Control

### 1. Branch Protection Rules (GitHub)
**Configurar después:**
```
Require status checks to pass before merging:
  ✅ CI Pipeline Frontend / test-and-coverage
  ✅ Require branches to be up to date before merging
```

### 2. Reportes Visibles en GitHub
```
Pull Request View:
  ├─ ✅ All checks passed
  ├─ 📊 Coverage: 75% (expandible)
  ├─ ✅ Linting: No issues
  └─ 📋 Test Results: 32 passed, 0 failed
```

---

## 📝 Archivos a Modificar/Crear

### Frontend (sofkify-fe)
```
Crear:
  .github/workflows/ci.yml  ← Pipeline principal

Modificar:
  package.json              ← Agregar script "test:coverage"
  vitest.config.ts          ← Agregar configuración de coverage (si es necesario)
```

---

## ✅ Checklist de Implementación

- [ ] Paso 1: Agregar script "test:coverage" a package.json
- [ ] Paso 2: Validar/completar vitest.config.ts con cobertura
- [ ] Paso 3: Crear workflow CI para Frontend
- [ ] Paso 4: Hacer un push con cambios para validar
- [ ] Paso 5: Verificar checks en GitHub
- [ ] Paso 6: Configurar branch protection rules en GitHub

---

## 🎓 Conceptos Clave para Junior

| Concepto | Explicación |
|----------|-------------|
| **Trigger** | El evento que inicia automáticamente el pipeline (push, PR) |
| **npm ci** | Instalación determinística (reproducible) vs `npm install` |
| **Vitest** | Test framework moderno para Vite/React |
| **Coverage** | Métrica que indica qué porcentaje de código está cubierto por tests |
| **ESLint** | Herramienta que valida la sintaxis y estilo de código |
| **Artefacto** | Fichero que GitHub Actions guarda para descargar después |

---

**Próximos pasos:** Implementar configuración y crear los archivos CI/CD.
