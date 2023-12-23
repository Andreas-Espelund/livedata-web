import { Individual } from '@/types/types';

type IndividualCardProps = {
  item: Individual;
};

const IndividualCard: React.FC<IndividualCardProps> = ({ item }) => {
  return (
    <div className="bg-white w-full border border-red-500 p-4 rounded-lg">
        <p>{item.id}</p>
        <p>{item.gender?'Soye':'Veir'}</p>
        <p>{item.gender?'Soye':'Veir'}</p>
        <p>{item.gender?'Soye':'Veir'}</p>
        <p>{item.gender?'Soye':'Veir'}</p>
    </div>
  );
};

export default IndividualCard;