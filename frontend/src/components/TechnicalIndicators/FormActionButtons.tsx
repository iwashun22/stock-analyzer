import Button from 'react-bootstrap/Button';

function FormActionButtons({ closeForm }: {
  closeForm: undefined | (() => unknown)
}) {
  return (
    <div className="mt-3 d-flex justify-content-center">
      {
        closeForm !== undefined && 
        <Button 
          variant='secondary'
          className="me-1"
          type='button'
          onClick={closeForm}
        >
          Close
        </Button>
      }
      <Button variant='primary' type='submit'>Save Changes</Button>
    </div>
  )
}

export default FormActionButtons;