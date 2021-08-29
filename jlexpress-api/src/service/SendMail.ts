type CheckStyle = {
    top: number,
    left: number,
}

type CheckValue = {
    valueA: boolean,
    valueB: boolean,
    valueC: boolean,
}

type FieldProps = {
    [key: string]: CheckValue,
}

type CarFleet = {
    placa: string,
    modelo: string,
    imagem: string
}

export type Data = {
    values: FieldProps,
    carFleet: CarFleet,
    listChecks: CheckStyle[];
    currentDate: string,
    fleetWidth: number,
    responsible: string
}

export default interface SendMail {
    execute(data: Data): void;
}