import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const folderPath = searchParams.get("path");

        if (!folderPath) {
            return NextResponse.json(
                { error: "Параметр path обязателен" },
                { status: 400 }
            );
        }

        // Путь к папке в public
        const publicPath = path.join(process.cwd(), "public", folderPath);

        // Проверяем существование папки
        if (!fs.existsSync(publicPath)) {
            return NextResponse.json(
                { error: `Папка не найдена: ${folderPath}` },
                { status: 404 }
            );
        }

        // Читаем содержимое папки
        const files = fs.readdirSync(publicPath);

        // Фильтруем только DICOM файлы (.dcm)
        const dicomFiles = files
            .filter((file) => {
                const ext = path.extname(file).toLowerCase();
                return ext === ".dcm" || ext === "";
            })
            .sort((a, b) => {
                // Сортировка по числовому значению в имени файла
                const numA = parseInt(a.match(/\d+/)?.[0] || "0");
                const numB = parseInt(b.match(/\d+/)?.[0] || "0");
                return numA - numB;
            });

        if (dicomFiles.length === 0) {
            return NextResponse.json(
                { error: "DICOM файлы не найдены в указанной папке" },
                { status: 404 }
            );
        }

        return NextResponse.json(dicomFiles);
    } catch (error) {
        console.error("Error reading DICOM directory:", error);
        return NextResponse.json(
            { error: "Ошибка чтения директории" },
            { status: 500 }
        );
    }
}