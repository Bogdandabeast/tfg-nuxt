#!/bin/bash

# Script para configurar sesiones de tmux para desarrollo en tfg-nuxt

tmux kill-server  # Cerrar cualquier sesión tmux existente

# Crear nueva sesión tmux llamada 'dev' con la primera ventana para docker
tmux new-session -d -s dev -n docker "cd /var/home/bobbie/Documentos/github/tfg-nuxt && docker compose up -d"

# Crear segunda ventana para pnpm run dev
tmux new-window -t dev:2 -n dev "cd /var/home/bobbie/Documentos/github/tfg-nuxt && pnpm run dev"

# Crear tercera ventana para opencode
tmux new-window -t dev:3 -n opencode "cd /var/home/bobbie/Documentos/github/tfg-nuxt && opencode"

# Crear cuarta ventana para fish en documents/github
tmux new-window -t dev:4 -n fish "cd /var/home/bobbie/Documentos/github && fish"

# abrir session de opencode

tmux attach-session -t dev:4