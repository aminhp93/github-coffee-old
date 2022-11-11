import request, { NoteUrls } from 'libs/request';

export const NoteService = {
  createNote(data: any) {
    return request({
      method: 'POST',
      url: NoteUrls.createNote,
      data,
    });
  },
  listNote() {
    return request({
      method: 'GET',
      url: NoteUrls.listNote,
    });
  },
  detailNote(noteId: number) {
    return request({
      method: 'GET',
      url: NoteUrls.detailNote(noteId),
    });
  },
  updateNote(noteId: number, data: any) {
    return request({
      method: 'PUT',
      url: NoteUrls.updateNote(noteId),
      data,
    });
  },
  deleteNote(noteId: any) {
    return request({
      method: 'DELETE',
      url: NoteUrls.deleteNote(noteId),
    });
  },
};
