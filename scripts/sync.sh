#!/bin/bash
set -e

CONTENT_DIR="./content"

rsync -av --delete \
  --exclude='.obsidian' \
  --exclude='.git' \
  --exclude='.claude' \
  --exclude='.venv' \
  --exclude='Inbox' \
  --exclude='Templates' \
  --exclude='mcp-servers' \
  --exclude='scripts' \
  --exclude='Canvas' \
  --exclude='Projects' \
  --exclude='source' \
  --exclude='System' \
  --exclude='Untitled' \
  --exclude='.env' \
  --exclude='.env.example' \
  --exclude='*.md~' \
  ~/obsidian/ "$CONTENT_DIR/"

generate_folder_index() {
  local dir="$1"
  local dir_name=$(basename "$dir")
  local index_file="$dir/index.md"
  
  case "$dir_name" in
    Attachments|Excalidraw|assets|link_notes) return ;;
  esac
  
  local title=$(echo "$dir_name" | sed 's/[-_]/ /g' | sed 's/\b\(.\)/\u\1/g')
  
  local content="---
title: $title
---

# $title

"

  local has_subdirs=false
  local subdirs=""
  for subdir in "$dir"/*/; do
    [ -d "$subdir" ] || continue
    local subdir_name=$(basename "$subdir")
    
    case "$subdir_name" in
      .*|assets|link_notes) continue ;;
    esac
    
    has_subdirs=true
    local subdir_title=$(echo "$subdir_name" | sed 's/[-_]/ /g' | sed 's/\b\(.\)/\u\1/g')
    
    if [ -f "$subdir/_Overview.md" ]; then
      subdirs+="- [[$subdir_name/_Overview|$subdir_title]]
"
    else
      subdirs+="- [[$subdir_name/index|$subdir_title]]
"
    fi
  done
  
  if [ "$has_subdirs" = true ]; then
    content+="## Folders

$subdirs
"
  fi

  local has_files=false
  local files=""
  for file in "$dir"/*.md; do
    [ -f "$file" ] || continue
    local file_name=$(basename "$file" .md)
    
    case "$file_name" in
      index|_Overview) continue ;;
    esac
    
    has_files=true
    local file_title=$(echo "$file_name" | sed 's/[-_]/ /g')
    files+="- [[$file_name|$file_title]]
"
  done
  
  if [ "$has_files" = true ]; then
    content+="## Notes

$files"
  fi

  if [ "$has_subdirs" = true ] || [ "$has_files" = true ]; then
    echo "$content" > "$index_file"
    echo "  Generated: $index_file"
  fi
}

generate_indexes_recursive() {
  local dir="$1"
  
  generate_folder_index "$dir"
  
  for subdir in "$dir"/*/; do
    [ -d "$subdir" ] || continue
    local subdir_name=$(basename "$subdir")
    
    case "$subdir_name" in
      .*|Attachments|Excalidraw|assets|link_notes) continue ;;
    esac
    
    generate_indexes_recursive "$subdir"
  done
}

echo "Generating folder indexes..."
generate_indexes_recursive "$CONTENT_DIR/Knowledge"

cat > "$CONTENT_DIR/index.md" << 'EOF'
---
title: Home
---

# Changeroa's Digital Garden

## AI Agents

- [[Knowledge/ai-agents/mcp/_Overview|MCP]]
- [[Knowledge/ai-agents/slack/_Overview|Slack Bot]]
- [[Knowledge/ai-agents/opencode-docs-ko/index|OpenCode Docs (KO)]]

## Computer Science

- [[Knowledge/computer-science/computer-security/index|Computer Security]]
- [[Knowledge/computer-science/operating-system/index|Operating System]]

## Engineering

- [[Knowledge/engineering/architecture/_Overview|Architecture]]
- [[Knowledge/engineering/frontend/index|Frontend]]
- [[Knowledge/engineering/infrastructure/_Overview|Infrastructure]]
- [[Knowledge/engineering/networking/_Overview|Networking]]
- [[Knowledge/engineering/security/_Overview|Security]]
- [[Knowledge/engineering/systems/_Overview|Systems]]
- [[Knowledge/engineering/class/index|Class]]

## Research

- [[Knowledge/research/reinforcement-learning/index|Reinforcement Learning]]
EOF

echo "✓ Sync complete with indexes generated"
