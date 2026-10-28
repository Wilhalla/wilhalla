#!/usr/bin/env bash
# shadcn writes alias imports (and sometimes a bare "cn" import); components in this package are
# consumed as source by every app, so they import each other relatively. Run after `shadcn add`
# (`just ui-add <component>` does).
set -euo pipefail
cd "$(dirname "$0")/src/components"
sed -i -E \
  -e 's#from "(cn|@wilhalla/ui/lib/utils|@/lib/utils)"#from "../lib/utils"#' \
  -e 's#from "@wilhalla/ui/components/([a-z-]+)"#from "./\1"#' \
  *.tsx
