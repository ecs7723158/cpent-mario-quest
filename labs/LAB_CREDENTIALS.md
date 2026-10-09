# Lab credentials

The SSH passwords in `docker-compose.yml` are for local Docker practice targets only.

They are not GitHub, banking, or personal account secrets. GitGuardian may still flag a hardcoded password, so the compose file reads them from the environment instead of storing them in the file.

## Use

```bash
cp labs/.env.example labs/.env
# edit the two LAB_* values, then:
docker compose --env-file labs/.env -f labs/docker-compose.yml up -d
```

`labs/.env` is gitignored. Do not commit real values. Rewriting Git history is not required for this lab password.
