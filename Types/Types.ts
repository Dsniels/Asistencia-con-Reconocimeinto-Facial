
type ResponseApi ={
    message : string;
    status : 'fail' | 'success';
    matches? : Array<string>
}

type asistencias= {
    [date: string]: string[];
}