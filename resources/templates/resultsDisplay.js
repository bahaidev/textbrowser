/* globals Templates, jml */
Templates.resultsDisplay = {
    main: ({tableData}) => {
        jml('table', {border: '1'}, tableData.map((tr) => ['tr',
            tr.map((td) => ['td',
                // [td] // Todo: For non-escaped!!!!
                {innerHTML: td}
            ])
        ]), document.body);
    }
};
