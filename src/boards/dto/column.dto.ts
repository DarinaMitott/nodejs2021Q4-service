import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class ColumnDto {
    @IsOptional()
    @IsUUID()
    id?: string | null | undefined;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    order: number;
}

