const TEMPLATE_COMPILER = `// Aturan:
// 1. Kode program hanya boleh ditulis didalam fungsi 'run'
// 2. Dilarang mengubah penamaan dan struktur pada kode diluar fungsi 'run'
// 3. Kerjakan soal didalam fungsi 'run'
// 4. Dilarang menghapus, mengubah nama dan parameter kode fungsi 'run'
// 5. Seluruh input akan secara otomatis masuk ke parameter fungsi 'run'
// 6. Output merupakan return dari fungsi 'run'
// 7. Tidak diperbolehkan menambahkan 'input' dan 'output' selain dari parameter dan return pada fungsi 'run'
// 8. Tidak menaati keseluruhan aturan dapat menyebabkan program gagal dijalankan
function run(x, y) {
    return "";
}
`

const TEMPLATE_HTML = `<!-- Aturan: -->
<!-- 1. Kode program dapat ditulis didalam kolom "HTML", "CSS", dan "JavaScript" yang telah disediakan -->
<!-- 2. Kerjakan kode html pada tag 'head' dan 'body' tanpa menghapus struktur kode yang telah disediakan -->
<!-- 3. Kode css dan javascript yang terdapat pada kolom "CSS" dan "JavaScript" akan dijalankan secara otomatis -->
<!-- 4. Dipersilahkan untuk menambahkan library yang diperlukan melalui cdn atau link yang bersangkutan (e.g. bootstrap, jquery, tailwindcss, dll) -->
<!-- 5. Tidak menaati keseluruhan aturan dapat menyebabkan program gagal dijalankan -->

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
  <body>
    Test
  </body>
</html>
`;

const TEMPLATE_CSS = `* {
  margin: 0;
  padding: 0;
}
`;

const TEMPLATE_JAVASCRIPT = `console.log('hello world')`;

export {
  TEMPLATE_COMPILER,
  TEMPLATE_HTML,
  TEMPLATE_CSS,
  TEMPLATE_JAVASCRIPT
}