import * as excel from "exceljs";

interface IObj {
    columns: string[];
    data: object;
}

// expects the output of
export const createExcel = async (inputObj: IObj, dataLength: number): Promise<excel.Buffer> => {
    let workbook = new excel.Workbook();
    workbook.creator = "ZenITExcelExport";
    workbook.created = new Date();
    let sheet = workbook.addWorksheet("SheetOne");
    sheet.columns = []
    sheet.getRow(1).values = inputObj.columns;
    for (let i = 0; i < dataLength; i++) {
        let rowData = Object.entries(inputObj.data).map(pair => pair[1][i])
        sheet.addRow(rowData)
    }
    sheet.getRow(1).fill = {
            type: 'pattern',
            pattern:'lightGray',
            bgColor:{argb:'ffffffff'},
            fgColor:{argb:'ffff0000'}
        };    
    return await workbook.xlsx.writeBuffer()
};

