import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('/foods');
      setFoods(response.data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const response = await api.post('foods', food);
      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }
  async function updateFood(food: IFoodPlate): Promise<void> {
    try {
      await api.put(`foods/${food.id}`, food);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'available'>,
  ): Promise<void> {
    const selected = foods.find(item => item.id === editingFood.id);
    Object.assign(selected, { ...food });
    if (selected) await updateFood(selected);
  }

  async function handleDeleteFood(id: number): Promise<void> {
    await api.delete(`foods/${id}`);
    const filtredFoods = foods.filter(food => food.id !== id);
    setFoods(filtredFoods);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    setEditingFood(food);
    toggleEditModal();
  }

  async function handleSetAvailable(food: IFoodPlate): Promise<void> {
    console.log('handleSetAvailable', food);
    updateFood(food);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              handleSetAvailable={handleSetAvailable}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
