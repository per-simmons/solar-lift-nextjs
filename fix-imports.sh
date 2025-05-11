#!/bin/bash

# Fix imports for v0-solar-lift-blog
find v0-solar-lift-blog/components/ui -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/|./|g'
find v0-solar-lift-blog/components/ui -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/hooks/|../hooks/|g'

# Fix imports for solar-lift-case-study-v0
find solar-lift-case-study-v0/components/ui -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/|./|g'
find solar-lift-case-study-v0/components/ui -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/hooks/|../hooks/|g'

# Fix imports for app/blog
find app/blog/blog-post-page-v0/components/ui -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/components/ui/|./|g'
find app/blog/blog-post-page-v0/components/ui -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|@/hooks/|../|g'

echo "All imports have been fixed!" 