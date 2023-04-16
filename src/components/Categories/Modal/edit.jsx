import React from 'react';
import Dialog from '../../Dialog';
import './style.css';

export default function EditModal({closeModal}) {
  return (
    <Dialog>
      <div className="wrap__category">
        <h3 className='forma__head'>EditCategory</h3>
        <form className='category__form'>
            <input type="file" name="image" className="form__field" placeholder='Cover photo' />
            <input type="text" name="name" className="form__field" placeholder='Name' />
          <div className="form__group">
            <button className="form__btn save">Save</button>
            <button className="form__btn close" onClick={closeModal}>Close</button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
