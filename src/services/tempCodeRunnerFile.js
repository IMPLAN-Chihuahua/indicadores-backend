    let wb = new Excel.Workbook();
    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    wb.xlsx.readFile('./src/utils/boop.xlsx')
        .then(() => {
            let ws = wb.getWorksheet(1);
            let row = ws.getRow(3);
            row.getCell(3).value = 'test';
            row.commit();
            res.end();
            return wb.xlsx.writeFile('test.xlsx');
        })