## Agents

- **Objetivo**: Garantir que todas as habilidades da pasta `.agents/skills/` sejam sempre carregadas e seguidas por padrão em qualquer tarefa neste repositório.

### Uso obrigatório de skills

- **Sempre usar skills em `.agents/skills/`**:
  - Antes de trabalhar em UI baseada em shadcn/ui (componentes em `src/components/ui`, páginas que usam esses componentes, ou qualquer comando `shadcn`), **carregar e seguir integralmente** a skill `shadcn` em `.agents/skills/shadcn/SKILL.md`.
  - Ao refatorar componentes React, desenhar APIs de componentes, ou trabalhar com padrões de composição (compound components, context, render props, etc.), **carregar e seguir** a skill `vercel-composition-patterns`.
  - Ao escrever, revisar ou refatorar código React/Next.js (páginas em `src/app`, componentes em `src/components`, hooks, data fetching, performance), **carregar e seguir** a skill `vercel-react-best-practices`.

### Regras para agentes

- **Obrigatório**:
  - Ler o arquivo `SKILL.md` correspondente **antes** de aplicar qualquer skill.
  - Seguir todas as regras marcadas como **CRITICAL**, **IMPORTANT** ou equivalentes em cada skill.
  - Mencionar explicitamente quando uma decisão ou implementação estiver sendo guiada por uma dessas skills (por exemplo: "seguindo a skill shadcn", "seguindo vercel-react-best-practices").
- **Resolução de conflitos**:
  - Se houver conflito entre uma skill específica (por exemplo, `shadcn`) e qualquer outro estilo pré-existente no projeto, **priorizar a skill específica**, a menos que exista uma regra explícita em contrário em algum `RULE.md` deste repositório.
  - Em caso de conflito entre duas skills, priorizar na seguinte ordem:
    1. Skills específicas de tecnologia/biblioteca (ex.: `shadcn`);
    2. Skills de arquitetura/composição de componentes (ex.: `vercel-composition-patterns`);
    3. Skills de performance/best practices gerais (ex.: `vercel-react-best-practices`).

### Escopo

- **Todo código deste repositório** que envolva:
  - UI com shadcn/ui ou `src/components/ui`.
  - Páginas, layouts, ou componentes React/Next.js.
  - Refatorações de componentes, hooks ou padrões de composição.

deve ser implementado e revisado **seguindo estritamente** as skills da pasta `.agents/skills/`.

