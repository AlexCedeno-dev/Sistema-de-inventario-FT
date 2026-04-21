import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import type { PendingAgent } from '../types/pendingAgent';

interface Props {
  open: boolean;
  agent: PendingAgent | null;
  loadingIgnore?: boolean;
  onClose: () => void;
  onIgnore: (agent: PendingAgent) => void;
  onRegister: (agent: PendingAgent) => void;
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={600}>
        {value && String(value).trim() !== '' ? value : 'N/D'}
      </Typography>
    </Box>
  );
}

export function NewAgentDetectedModal({
  open,
  agent,
  loadingIgnore = false,
  onClose,
  onIgnore,
  onRegister,
}: Props) {
  if (!agent) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Se detectó un nuevo agente
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body1">
            Este equipo aún no está registrado en el inventario nuevo.
            ¿Deseas registrarlo ahora?
          </Typography>

          <Divider />

          <Stack spacing={2}>
            <InfoRow label="Hostname" value={agent.hostname} />
            <InfoRow label="Usuario" value={agent.usuario} />
            <InfoRow label="Service Tag" value={agent.service_tag} />
            <InfoRow label="Serial" value={agent.serial_number} />
            <InfoRow label="Marca" value={agent.marca} />
            <InfoRow label="Modelo" value={agent.modelo} />
            <InfoRow label="Tipo de equipo" value={agent.tipo_equipo} />
            <InfoRow label="IP" value={agent.ip} />
            <InfoRow label="Sistema" value={agent.plataforma} />
            <InfoRow label="Versión Windows" value={agent.version_windows} />
            <InfoRow label="Última conexión" value={agent.last_seen} />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={() => onIgnore(agent)}
          disabled={loadingIgnore}
          variant="outlined"
        >
          Ignorar por ahora
        </Button>

        <Button
          onClick={() => onRegister(agent)}
          variant="contained"
        >
          Registrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}