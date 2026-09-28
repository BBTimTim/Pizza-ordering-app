# Közös SSH/SCP beállítások a scriptekhez (source-szal töltődik be)
KEY_OPTS=(-i keys/id_ed25519 -o UserKnownHostsFile=keys/known_hosts -o StrictHostKeyChecking=accept-new -o IdentitiesOnly=yes)
SSH_OPTS=(-p 2222 "${KEY_OPTS[@]}")
SCP_OPTS=(-q -P 2222 "${KEY_OPTS[@]}")
SERVER=deploy@localhost
