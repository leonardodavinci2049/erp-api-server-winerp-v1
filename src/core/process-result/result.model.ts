export class ResultModel {
  constructor(
    public statusCode: number,
    public message: string,
    public recordId: string,
    public data: unknown,
    public quantity?: number,
    public errorId?: number,
    public info1?: string,
    public info2?: string,
  ) {}
}
