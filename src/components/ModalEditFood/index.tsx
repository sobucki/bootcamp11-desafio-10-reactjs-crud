import React, { useRef, useCallback } from 'react';
import * as Yup from 'yup';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleUpdateFood: (food: Omit<IFoodPlate, 'available'>) => void;
  editingFood: IFoodPlate;
}

interface IEditFoodData {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
}

const ModalEditFood: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  editingFood,
  handleUpdateFood,
}) => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: IEditFoodData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          image: Yup.string().required('A url é obrigatória'),
          name: Yup.string().required('Nome é obrigatório'),
          price: Yup.number()
            .required('O preço é obrigatorio')
            .positive('Permitido somente preço positivo'),
          description: Yup.string().required('Descrição é obrigatória'),
        });

        await schema.validate(data, { abortEarly: false });

        console.log('handleSubmit', data);
        handleUpdateFood(data);
        setIsOpen();
      } catch (error) {
        console.log(error);
      }
    },
    [handleUpdateFood, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalEditFood;
