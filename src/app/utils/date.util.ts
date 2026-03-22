export class DateUtils {
    static convertDate(timestamp: any): string {
        const date = new Date(timestamp.seconds * 1000);
        const padZero = (num: number) => (num < 10 ? `0${num}` : num);
        const day = padZero(date.getDate());
        const month = padZero(date.getMonth() + 1);
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = padZero(date.getMinutes());
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;

        return `${day}/${month}/${year} ${padZero(hours)}:${minutes} ${ampm}`;
    }
    static convertDateWithoutTime(timestamp: any): string {
        const date = new Date(timestamp.seconds * 1000);
        const padZero = (num: number) => (num < 10 ? `0${num}` : num);
        const day = padZero(date.getDate());
        const month = padZero(date.getMonth() + 1);
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
    static convertStringInputDateToDate(fechaString: string): Date | null {
        try {
            const [year, month, day] = fechaString.split('-').map(Number);
            const fecha = new Date(year, month - 1, day);
            if (isNaN(fecha.getTime())) {
                throw new Error("Fecha inválida");
            }
            return fecha;
        } catch (error) {
            console.error("Error al convertir la fecha:", error);
            return null;
        }
    }
    static convertTo12HourFormat(time24: string): string {
        const [hour24, minutes] = time24.split(':').map(Number);
        const amPm = hour24 >= 12 ? 'PM' : 'AM';
        const hour12 = hour24 % 12 || 12;
        return `${hour12}:${String(minutes).padStart(2, '0')} ${amPm}`;
    }

    static formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0
        const year = date.getFullYear().toString();
        return `${day}/${month}/${year}`;
    }

    static formatDateTime(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0
        const year = date.getFullYear().toString();

        // Obtener la hora y convertirla a formato de 12 horas
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12; // Convertir a formato de 12 horas
        hours = hours ? hours : 12; // El '0' debe convertirse en '12'

        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    }

    static formatCurrency(amount: number): string {
        return `S/. ${amount.toFixed(2)}`;
    }

    // convertir timestamp de firebase a fecha legible en español, formato dd/mm/yyyy hh:mm
    static formatFirebaseTimestamp(timestamp: any): string {
        const date = new Date(timestamp.seconds * 1000);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

}