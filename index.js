/*globals getJSON, jml*/
(function () {'use strict';

document.title = "Sacred Writings Browser";

getJSON('databases.json', function (json) {
    jml(
        'div',
        {style: 'text-align:center'},
        json.map(function (db, i) {
            return ['div', [
                (i > 0 ? ['br', 'br', 'br'] : ''),
                ['div', [db.directions]],
                ['br'],
                ['select', {'class': 'file', dataset: {name: db.name}, $on: {change: function (e) {
                    // Submit
                    // alert(e.target.dataset.name);
                    
                    getJSON(e.target.selectedOptions[0].dataset.file, function (fileJSON) {
                        alert(JSON.stringify(fileJSON));
                    });
                }}}, 
                    db.files.map(function (file) {
                        return ['option', {dataset: {file: db.baseDirectory + '/' + file.file}}, [file.name]];
                    })
                ],
                ['p', [
                    ['input', {type: 'button', value: "Go"}]
                ]]
            ]];
        }),
        document.body
    );
});

}());
