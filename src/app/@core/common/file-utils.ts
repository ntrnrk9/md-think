export class FileUtils {
    public static getFileName(fileExtension) {
        const currentDate = new Date();
        return (
            'DHS-' +
            currentDate.getUTCFullYear() +
            currentDate.getUTCMonth() +
            currentDate.getUTCDate() +
            '-' +
            this.getRandomString() +
            '.' +
            fileExtension
        );
    }

    public static getRandomString() {
        return (Math.random() * new Date().getTime())
            .toString(36)
            .replace(/\./g, '');
    }
}
