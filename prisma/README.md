### Generate Migration (locally)
`npx prisma migrate dev --name <MIGRATION_NAME>`
`npx prisma generate` (to update the JS client)
### Apply Migrations (stage/prod)
`npx prisma migrate deploy`

### DB Viewer
`npx prisma studio`

### Seed DB
`npx prisma db seed`