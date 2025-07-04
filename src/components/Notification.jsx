const Notification = ({ errorMessage }) => {
  if (errorMessage) {
    return <h2>{errorMessage}</h2>
  }
}

export default Notification