// STATUS = notStarted || inProgress || completed

const STEPS_BUNDLE = [
  {
      key: "createBundle",
      name: "Create Bundle",
      status: "inProgress",
  },
  {
      key: "listMateri",
      name: "List Materi",
      status: 'notStarted',
  },
];

const TABLE_SELECT_COURSE = [
  {
    key: "checklist", 
    label: 'Pilih',
    thStyle: 'width: 0%',
  },
  {
      key: 'title',
      label: 'Judul',
      thStyle: 'width: 20%',
  },
  {
      key: 'authorName',
      label: 'Author',
      thStyle: 'width: 20%',
  },
  {
      key: 'modulCount',
      label: 'Jumlah Modul',
      thStyle: 'width: 10%',
  },
  {
      key: 'latestUpdate',
      label: 'Last Update',
      thStyle: 'width: 10%',
  },
]

export {
  STEPS_BUNDLE,
  TABLE_SELECT_COURSE,
}