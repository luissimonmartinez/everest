export class OrderUtils {

    // el metodo reciber un array de objetos con las propiedades name, url y date(timestamp) y debe ordenar el array por la propiedad date de forma descendente, es decir, de la fecha mas reciente a la mas antigua
    static sortByDateDescending(arr: { name: string, url: string, date: any }[]): { name: string, url: string, date: any }[] {
        function toDate(date: any): Date {
            if (date instanceof Date) return date;
            if (typeof date === 'string' || typeof date === 'number') return new Date(date);
            if (date && typeof date.seconds === 'number') {
                // Firestore Timestamp: seconds y nanoseconds
                return new Date(date.seconds * 1000 + Math.floor((date.nanoseconds || 0) / 1e6));
            }
            return new Date(0); // fallback
        }
        return arr.sort((a, b) => {
            const dateA = toDate(a.date);
            const dateB = toDate(b.date);
            return dateB.getTime() - dateA.getTime();
        });
    }

}