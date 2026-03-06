interface Props {
  addPhoto: (file: File) => void
}

export const PassportUploadButton = ({ addPhoto }: Props) => {
  return (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        if (!e.target.files) return
        addPhoto(e.target.files[0])
      }}
    />
  )
}