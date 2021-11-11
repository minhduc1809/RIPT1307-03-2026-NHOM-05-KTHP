import textinput from '@/assets/DichVuMotCua/Input.png';
import textarea from '@/assets/DichVuMotCua/TextArea.png';

const valueByType = {
  TEXT_INPUT: {
    img: textinput,
    text: 'Text 1 dòng',
  },
  TEXT_AREA: {
    img: textarea,
    text: 'Text nhiều dòng',
  },
};

const ElementDescription = (props: { type: string; text: string }) => {
  return (
    <div style={{ width: 150, height: 150, padding: 8, borderRadius: 5, backgroundColor: '#000' }}>
      <img
        style={{ width: 134, height: 100, objectFit: 'cover' }}
        src={valueByType?.[props?.type]?.img}
      />
      <div style={{ color: '#fff' }}>{valueByType?.[props?.type]?.text}</div>
    </div>
  );
};

export default ElementDescription;
