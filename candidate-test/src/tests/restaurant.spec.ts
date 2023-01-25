import { ApiResponse } from '../infra/rest/api-response';
import { Restaurant } from '../logic/REST/API-Response/get-restaurants-response';
import { expect } from 'chai';


import restaurantsAPI from '../logic/REST/restaurantsAPI';

describe('Restaurants tests', () => {

    before('Reset restaurant server', async () => {
        //Arrange
        await restaurantsAPI.resetServer();
    })

    it('Validate the amount of restaurants', async () => {
        //Act
        const restaurants: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants();
        console.log(restaurants.data);

        //Assert
        expect(restaurants.success).to.be.true;
        const actualAmount = restaurants.data?.length;
        expect(actualAmount).to.equal(3, 'Restaurants amount is not as expected');
    })

    it('Get restaurant by id', async () => {
        const restaurantId = 233
        //Act - Create restaurant
        const myNewRest = { address: "My Addess 1", id: restaurantId, name: "My Restaurant", score: 2.3 };
        const createResponse = await restaurantsAPI.createRestaurant(myNewRest);
        //Assert
        expect(createResponse.status).to.equal(200);
        expect(createResponse.success).to.be.true;

        //Act - Get restaurant by id
        const getByIdResponse = await restaurantsAPI.getRestaurantById(233);

        //Assert
        expect(getByIdResponse.status).to.equal(200);
        expect(getByIdResponse.success).to.be.true;
        expect(getByIdResponse.data).to.deep.equal(myNewRest);
    })

    it('Get non exsisting restaurant', async () => {
        const restaurantId = 233
        const getByIdResponse0 = await restaurantsAPI.getRestaurantById(restaurantId);
        // Delete the restaurant if it exists 
        if(getByIdResponse0.success == true && getByIdResponse0.status == 200)
        {
            const getByIdResponse = await restaurantsAPI.deleteRestaurantById(restaurantId);
            //Assert
            expect(getByIdResponse.success).to.be.true;
            expect(getByIdResponse.status).to.equal(200);
        }

        //Act - Get non exsisting restaurant
        const getByIdResponse = await restaurantsAPI.getRestaurantById(restaurantId);

        //Assert
        expect(getByIdResponse.error).to.equal("restaurant with given id not found");
        expect(getByIdResponse.success).to.be.false;
        expect(getByIdResponse.status).to.equal(404);
    })

    it('Update non exsisting restaurant properties', async () => {
        const restaurantId = 789
        const getByIdResponse = await restaurantsAPI.getRestaurantById(restaurantId);
        // Delete the restaurant if it exists 
        if(getByIdResponse.success == true && getByIdResponse.status == 200)
        {
            const getByIdResponse = await restaurantsAPI.deleteRestaurantById(restaurantId);
            //Assert
            expect(getByIdResponse.success).to.be.true;
            expect(getByIdResponse.status).to.equal(200);
        }

        //Act
        const myNewRest = { address: "My Addess 1", id: restaurantId, name: "My Restaurant 1", score: 1.3 };
        const getByIdResponse0 = await restaurantsAPI.patchRestaurantById(myNewRest);

        //Assert
        expect(getByIdResponse0.error).to.equal("restaurant with given id not found");
        expect(getByIdResponse0.success).to.be.false;
        expect(getByIdResponse0.status).to.equal(404);

    })

    it('Update restaurant properties ', async () => {

        const restaurantId = 100
        //Create restaurant
        const myNewRest = { address: "My Addess 1", id: restaurantId, name: "My Restaurant", score: 2.3 };
        const createResponse = await restaurantsAPI.createRestaurant(myNewRest);
        expect(createResponse.status).to.equal(200);
        expect(createResponse.success).to.be.true;

        //Act - patch Restaurant By Id
        const myNewRest1 = { address: "My Addess 42", id: restaurantId, name: "My Restaurant 42", score: 4.2 };
        const patchResponse = await restaurantsAPI.patchRestaurantById(myNewRest1);

        //Assert
        expect(patchResponse.success).to.be.true;
        expect(patchResponse.status).to.equal(200);


         //Get the relevant restaurant after updating
        // const getByIdResponse1 = await restaurantsAPI.getRestaurantById(restaurantId);
        // expect(getByIdResponse1.status).to.equal(200);
        // expect(getByIdResponse1.data).to.equal(myNewRest1, "updating failed !");

    })


    it('Delete exsisting restaurant', async () => {

        const restaurantId = 233
        //Create restaurant
        const myNewRest = { address: "My Addess 1", id: restaurantId, name: "My Restaurant", score: 2.3 };
        const createResponse = await restaurantsAPI.createRestaurant(myNewRest);
        expect(createResponse.status).to.equal(200);
        expect(createResponse.success).to.be.true;
        //Act - delete restaurant
        const getByIdResponse = await restaurantsAPI.deleteRestaurantById(restaurantId);

        //Assert
        expect(getByIdResponse.success).to.be.true;
        expect(getByIdResponse.status).to.equal(200);


    })

    it('Delete non exsisting restaurant', async () => {
        const restaurantId = 233
        const getByIdResponse0 = await restaurantsAPI.getRestaurantById(restaurantId);
        // deleting resturant with restaurantId if it exists 
        if(getByIdResponse0.success == true && getByIdResponse0.status == 200)
        {
            const getByIdResponse1 = await restaurantsAPI.deleteRestaurantById(restaurantId);
            //Assert 
            expect(getByIdResponse1.success).to.be.true;
            expect(getByIdResponse1.status).to.equal(200);
        }
        //Act
        const getByIdResponse1 = await restaurantsAPI.deleteRestaurantById(restaurantId);
        //Assert  that restaurant with given id not found
        expect(getByIdResponse1.error).to.equal("restaurant with given id not found");
        expect(getByIdResponse1.success).to.be.false;
        expect(getByIdResponse1.status).to.equal(404);
    })

})
