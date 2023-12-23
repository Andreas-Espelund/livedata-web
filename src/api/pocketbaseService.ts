import PocketBase from 'pocketbase';
import {Breeder, Individual} from "@/types/types";

const pb = new PocketBase('https://livedata-backend.fly.dev');


export async function getIndividuals() {
    // fetch a paginated records list
    const records = await pb.collection('individuals').getFullList({
        sort: '-created',
        expand: 'mother,father',
        requestKey: null
    });


    return records.map((d): Individual => ({
        created: d.created,
        tag: d.tag,
        updated: d.updated,
        active: d.active,
        birth_date: d.birth_date,
        bottle: d.bottle,
        father: d.expand?.father?.tag, // Access father's tag
        gender: d.gender,
        id: d.id,
        mother: d.expand?.mother?.tag // Access mother's tag
    }));

}

export async function getBreeders() {
    const records = await pb.collection('breeders').getFullList({
        expand: 'individual',
        requestKey: null
    });

    return records.map((d): Breeder => ({
        id: d.expand?.individual.id,
        nickname: d.nickname,
        tag: d.expand?.individual.tag
    }))
}

export async function createIndividual(data: Individual) {


    const record = await pb.collection('individuals').create(data);
}

export async function deactivateIndividual(data: any) {
    const payload = {
        "active": false
    };

    await pb.collection("individuals").update(data.id, payload)
}

//
// // or fetch only the first record that matches the specified filter
// const record = await pb.collection('individuals').getFirstListItem('someField="test"', {
//     expand: 'relField1,relField2.subRelField',
// });