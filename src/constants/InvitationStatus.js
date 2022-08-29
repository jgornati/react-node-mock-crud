export const PENDIENTE = 'Pendiente';
export const CONFIRMADA = 'Confirmada';
export const CANCELADA = 'Cancelada';
export const EXPIRADA = 'Expirada';

export const PENDIENTE_ID = 2;
export const CONFIRMADA_ID = 1;
export const CANCELADA_ID = 3;
export const EXPIRADA_ID = 4;

export const evaluateInvitationID = (statusName) => {
    switch (statusName) {
        case PENDIENTE_ID:
            return PENDIENTE;
        case CONFIRMADA_ID:
            return CONFIRMADA;
        case CANCELADA_ID:
            return CANCELADA;
        case EXPIRADA_ID:
            return EXPIRADA;
        default:
            return "Todos";
    }
}

export const evaluateInvitationDes = (statusName) => {
    switch (statusName) {
        case PENDIENTE:
            return PENDIENTE_ID;
        case CONFIRMADA:
            return CONFIRMADA_ID;
        case CANCELADA:
            return CANCELADA_ID;
        case EXPIRADA:
            return EXPIRADA_ID;
        default:
            return 0;
    }
}