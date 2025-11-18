import { RolUsuario, EstadoContratacion } from '../../core/supabase/database.types';

// Entidad Usuario/Perfil
export class Perfil {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly nombreCompleto: string | null,
    public readonly telefono: string | null,
    public readonly rol: RolUsuario,
    public readonly avatarUrl: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get esAsesor(): boolean {
    return this.rol === 'asesor_comercial';
  }

  get esUsuario(): boolean {
    return this.rol === 'usuario_registrado';
  }

  get nombreMostrar(): string {
    return this.nombreCompleto || this.email.split('@')[0];
  }
}

// Entidad Plan Móvil
export class PlanMovil {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly precio: number,
    public readonly datosGb: string,
    public readonly minutos: string,
    public readonly sms: string,
    public readonly velocidad4g: string,
    public readonly velocidad5g: string | null,
    public readonly redesSociales: string,
    public readonly whatsapp: string,
    public readonly llamadasInternacionales: string,
    public readonly roaming: string,
    public readonly segmento: string,
    public readonly publicoObjetivo: string,
    public readonly imagenUrl: string | null,
    public readonly activo: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get precioFormateado(): string {
    return `$${this.precio.toFixed(2)}`;
  }

  get esBasico(): boolean {
    return this.segmento.toLowerCase().includes('básico') || 
           this.segmento.toLowerCase().includes('entrada');
  }

  get esPremium(): boolean {
    return this.segmento.toLowerCase().includes('premium') || 
           this.segmento.toLowerCase().includes('alto');
  }

  get colorCategoria(): string {
    if (this.esBasico) return '#4caf50';
    if (this.esPremium) return '#ff6f00';
    return '#2196f3';
  }
}

// Entidad Contratación
export class Contratacion {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly planId: string,
    public readonly estado: EstadoContratacion,
    public readonly fechaContratacion: Date,
    public readonly fechaAprobacion: Date | null,
    public readonly asesorId: string | null,
    public readonly notas: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    // Relaciones opcionales
    public readonly plan?: PlanMovil,
    public readonly usuario?: Perfil,
    public readonly asesor?: Perfil
  ) {}

  get estaPendiente(): boolean {
    return this.estado === 'pendiente';
  }

  get estaAprobada(): boolean {
    return this.estado === 'aprobada';
  }

  get estaRechazada(): boolean {
    return this.estado === 'rechazada';
  }

  get estadoColor(): string {
    switch (this.estado) {
      case 'pendiente': return '#ff8f00';
      case 'aprobada': return '#4caf50';
      case 'rechazada': return '#f44336';
      default: return '#9e9e9e';
    }
  }

  get estadoTexto(): string {
    switch (this.estado) {
      case 'pendiente': return 'Pendiente';
      case 'aprobada': return 'Aprobada';
      case 'rechazada': return 'Rechazada';
      default: return 'Desconocido';
    }
  }

  get estadoIcono(): string {
    switch (this.estado) {
      case 'pendiente': return '⏳';
      case 'aprobada': return '✅';
      case 'rechazada': return '❌';
      default: return '❓';
    }
  }
}

// Entidad Mensaje Chat
export class MensajeChat {
  constructor(
    public readonly id: string,
    public readonly contratacionId: string,
    public readonly remitenteId: string,
    public readonly mensaje: string,
    public readonly leido: boolean,
    public readonly createdAt: Date,
    // Relación opcional
    public readonly remitente?: Perfil
  ) {}

  esMio(userId: string): boolean {
    return this.remitenteId === userId;
  }

  get horaFormateada(): string {
    return this.createdAt.toLocaleTimeString('es-EC', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}

// Entidad Estado de Escritura
export class ChatTyping {
  constructor(
    public readonly id: string,
    public readonly contratacionId: string,
    public readonly usuarioId: string,
    public readonly isTyping: boolean,
    public readonly updatedAt: Date
  ) {}
}

// DTOs para crear/actualizar
export interface CreatePlanDTO {
  nombre: string;
  precio: number;
  datosGb: string;
  minutos: string;
  sms: string;
  velocidad4g: string;
  velocidad5g?: string | null;
  redesSociales: string;
  whatsapp: string;
  llamadasInternacionales: string;
  roaming: string;
  segmento: string;
  publicoObjetivo: string;
}

export interface UpdatePerfilDTO {
  nombreCompleto?: string;
  telefono?: string;
  avatarUrl?: string;
}

export interface CreateContratacionDTO {
  planId: string;
  notas?: string;
}

export interface UpdateContratacionDTO {
  estado?: EstadoContratacion;
  asesorId?: string;
  notas?: string;
  fechaAprobacion?: Date;
}

export interface SendMessageDTO {
  contratacionId: string;
  mensaje: string;
}