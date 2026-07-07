import { auth } from "../src/lib/auth/auth"
import { prisma } from "../src/lib/db/prisma"
import { faker } from '@faker-js/faker';
import {CardType} from "../src/generated/prisma/enums";

async function main() {
    //    create admin user
    const { user: admin } = await auth.api.signUpEmail({
        body: {
            email: "admin@example.com",
            password: "password1234",
            name: "Admin User",
            image: faker.image.avatar(),
        }
    })
    // update admin user role to admin
    await prisma.user.update({
        where: {
            id: admin.id,
        },
        data: {
            role: "ADMIN",
        }
    })

    // update admin status to Approved
    const approvedStatus = await prisma.status.create({
        data: {
            name: "APPROVED",
        }
    })

    await prisma.userStatus.create({
        data: {
            userId: admin.id,
            statusId: approvedStatus.id,
            createdById: admin.id,
            notes: "Initial status set to APPROVED for admin user",
        }
    })

    const pendingStatus = await prisma.status.create({
        data: {
            name: "PENDING",
        }
    })

    const shopManagers = [];
    // create 10 shop manager users
    for (let i = 0; i < 10; i++) {
        const { user: shopManager } = await auth.api.signUpEmail({
            body: {
                email: faker.internet.email(),
                password: "password1234",
                name: faker.person.fullName(),
                image: faker.image.avatar(),
            }
        });
        await prisma.userStatus.create({
            data: {
                userId: shopManager.id,
                statusId: pendingStatus.id,
                createdById: admin.id,
                notes: "Initial status set to PENDING for shop manager user",
            }
        })

        // update shop manager user role to shop manager
        await prisma.user.update({
            where: {
                id: shopManager.id,
            },
            data: {
                role: "SHOP_MANAGER",
            }
        })
        shopManagers.push(shopManager);
    }

    // approve first 5 shop managers
    for (let i = 0; i < 5; i++) {
        const shopManager = shopManagers[i];
        await prisma.userStatus.updateMany({
            where: {
                userId: shopManager.id,
                isCurrent: true,
            },
            data: {
                isCurrent: false,
            }
        })
        await prisma.userStatus.create({
            data: {
                userId: shopManager.id,
                statusId: approvedStatus.id,
                createdById: admin.id,
                notes: "Status updated to APPROVED for shop manager user",
            }
        })
    }

    //    create 10 shop categories with unique names
    const categories = [];
    const categoryNames = new Set<string>();
    while (categoryNames.size < 10) {
        categoryNames.add(faker.commerce.department());
    }

    for (const name of categoryNames) {
        const category = await prisma.category.create({
            data: {
                name: name,
            }
        })
        categories.push(category);
    }

    // create 10 state gsts with unique state names
    const stateGsts = [];
    const states = new Set<string>();
    while (states.size < 10) {
        states.add(faker.location.state());
    }
    for (const state of states) {
        const stateGst = await prisma.stateGst.create({
            data: {
                state: state,
                gstNumber: faker.string.alphanumeric(15).toUpperCase(),
            }
        })
        stateGsts.push(stateGst);
    }

    const shops = [];
    // create 10 shops
    for (let i = 0; i < 10; i++) {
        const address = await prisma.address.create({
            data: {
                addressLine: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                postalCode: faker.location.zipCode(),
                country: faker.location.country(),
            }
        });
        const shop = await prisma.shop.create({
            data: {
                name: faker.company.name(),
                code: faker.string.alphanumeric(10),
                phone: faker.phone.number(),
                email: faker.internet.email(),
                description: faker.lorem.paragraph(),
                addressId: address.id,
                categoryId: faker.helpers.arrayElement(categories).id,
                stateGstId: faker.helpers.arrayElement(stateGsts).id,
            }
        });

        await prisma.shopStatus.create({
            data: {
                shopId: shop.id,
                statusId: pendingStatus.id,
                createdById: admin.id,
                notes: "Initial status set to PENDING for shop",
            }
        })
        shops.push(shop);
    }

    const activeStatus = await prisma.status.create({
        data: {
            name: "ACTIVE",
        }
    })

    // activate first 5 shops
    for (let i = 0; i < 5; i++) {
        const shop = shops[i];
        await prisma.shopStatus.updateMany({
            where: {
                shopId: shop.id,
                isCurrent: true,
            },
            data: {
                isCurrent: false,
            }
        })
        await prisma.shopStatus.create({
            data: {
                shopId: shop.id,
                statusId: activeStatus.id,
                createdById: admin.id,
                notes: "Status updated to ACTIVE for shop",
            }
        })

    }

    // assign first 5 shop managers to first 5 shops
    for (let i = 0; i < 5; i++) {
        const shopManager = shopManagers[i];
        const shop = shops[i];
        await prisma.shopManager.create({
            data: {
                shopId: shop.id,
                userId: shopManager.id,
            }
        })
    }

    const warehouseManagers = [];
    // create 10 warehouse manager users
    for (let i = 0; i < 10; i++) {
        const { user: warehouseManager } = await auth.api.signUpEmail({
            body: {
                email: faker.internet.email(),
                password: "password1234",
                name: faker.person.fullName(),
                image: faker.image.avatar(),
            }
        });
        await prisma.userStatus.create({
            data: {
                userId: warehouseManager.id,
                statusId: pendingStatus.id,
                createdById: admin.id,
                notes: "Initial status set to PENDING for warehouse manager user",
            }
        })

        // update warehouse manager user role to warehouse manager
        await prisma.user.update({
            where: {
                id: warehouseManager.id,
            },
            data: {
                role: "WAREHOUSE_MANAGER",
            }
        })
        warehouseManagers.push(warehouseManager);
    }

    // approve first 5 warehouse managers
    for (let i = 0; i < 5; i++) {
        const warehouseManager = warehouseManagers[i];
        await prisma.userStatus.updateMany({
            where: {
                userId: warehouseManager.id,
                isCurrent: true,
            },
            data: {
                isCurrent: false,
            }
        })
        await prisma.userStatus.create({
            data: {
                userId: warehouseManager.id,
                statusId: approvedStatus.id,
                createdById: admin.id,
                notes: "Status updated to APPROVED for warehouse manager user",
            }
        })
    }

    const warehouses = [];
    // create 10 warehouses
    for (let i = 0; i < 10; i++) {
        const address = await prisma.address.create({
            data: {
                addressLine: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                postalCode: faker.location.zipCode(),
                country: faker.location.country(),
            }
        });
        const warehouse = await prisma.warehouse.create({
            data: {
                name: faker.company.name(),
                code: faker.string.alphanumeric(10),
                phone: faker.phone.number(),
                email: faker.internet.email(),
                description: faker.lorem.paragraph(),
                addressId: address.id,
            }
        });

        await prisma.warehouseStatus.create({
            data: {
                warehouseId: warehouse.id,
                statusId: pendingStatus.id,
                createdById: admin.id,
                notes: "Initial status set to PENDING for warehouse",
            }
        })
        warehouses.push(warehouse);
    }

    // activate first 5 warehouses
    for (let i = 0; i < 5; i++) {
        const warehouse = warehouses[i];
        await prisma.warehouseStatus.updateMany({
            where: {
                warehouseId: warehouse.id,
                isCurrent: true,
            },
            data: {
                isCurrent: false,
            }
        })
        await prisma.warehouseStatus.create({
            data: {
                warehouseId: warehouse.id,
                statusId: activeStatus.id,
                createdById: admin.id,
                notes: "Status updated to ACTIVE for warehouse",
            }
        })

    }

    // assign first 5 warehouse managers to first 5 warehouses
    for (let i = 0; i < 5; i++) {
        const warehouseManager = warehouseManagers[i];
        const warehouse = warehouses[i];
        await prisma.warehouseManager.create({
            data: {
                warehouseId: warehouse.id,
                userId: warehouseManager.id,
            }
        })
    }

    const users = [];
    // create 50 users by 5 shop managers (10 users each)
    for (let i = 0; i < 5; i++) {
        const shopManager = shopManagers[i];
        for (let j = 0; j < 10; j++) {
            const { user } = await auth.api.signUpEmail({
                body: {
                    email: faker.internet.email(),
                    password: "password1234",
                    name: faker.person.fullName(),
                    image: faker.image.avatar(),
                }
            });
            // address
            const address = await prisma.address.create({
                data: {
                    addressLine: faker.location.streetAddress(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    postalCode: faker.location.zipCode(),
                    country: faker.location.country(),
                }
            });
            // user address
            await prisma.userAddress.create({
                data: {
                    userId: user.id,
                    addressId: address.id,
                    isPrimary: true,
                }
            })

            // documents
            const aadhaarFront = await prisma.media.create({
                data: {
                    url: faker.image.url(),
                    type: "IMAGE",
                }
            })
            const aadhaarBack = await prisma.media.create({
                data: {
                    url: faker.image.url(),
                    type: "IMAGE",
                }
            })
            await prisma.userDocument.create({
                data: {
                    userId: user.id,
                    mediaId: aadhaarFront.id,
                    type: "AADHAAR_FRONT",
                    createdById: shopManager.id,
                }
            })
            await prisma.userDocument.create({
                data: {
                    userId: user.id,
                    mediaId: aadhaarBack.id,
                    type: "AADHAAR_BACK",
                    createdById: shopManager.id,
                }
            })

            // set user status to pending
            await prisma.userStatus.create({
                data: {
                    userId: user.id,
                    statusId: pendingStatus.id,
                    createdById: shopManager.id,
                    notes: "Initial status set to PENDING for user",
                }
            })

            users.push(user);
        }
    }

    // approve first 25 users
    for (let i = 0; i < 25; i++) {
        const user = users[i];
        await prisma.userStatus.updateMany({
            where: {
                userId: user.id,
                isCurrent: true,
            },
            data: {
                isCurrent: false,
            }
        })
        await prisma.userStatus.create({
            data: {
                userId: user.id,
                statusId: approvedStatus.id,
                createdById: admin.id,
                notes: "Status updated to APPROVED for user",
            }
        })
    }

    // create 25 cards for first 25 users means each user will have 1 card
    // create 5 cards for each card type
    // assign 5 active shop with 25 cards means each shop will have 5 cards
    const cardTypes = Object.values(CardType);

    const cards = [];

    for (let i = 0; i < 25; i++) {
        const user = users[i];
        const shop = shops[i % 5]; // assign to first 5 active shops
        const cardType = cardTypes[i % cardTypes.length]; // rotate through card types

        const card = await prisma.card.create({
            data: {
                cardNumber: faker.string.numeric(16),
                cardHolder: user.name,
                expiryDate: faker.date.future(),
                type: cardType,
                points: faker.number.int({ min: 0, max: 1000 }),
                userId: user.id,
                shopId: shop.id,
            }
        })
        cards.push(card);
        await prisma.cardStatus.create({
            data: {
                cardId: card.id,
                statusId: pendingStatus.id,
                createdById: admin.id,
            }
        })
    }


    // approve first 15 cards
    for (let i = 0; i < 15; i++) {
        const card = cards[i];
        await prisma.cardStatus.updateMany({
            where: {
                cardId: card.id,
                isCurrent: true,
            },
            data: {
                isCurrent: false,
            }
        })
        await prisma.cardStatus.create({
            data: {
                cardId: card.id,
                statusId: approvedStatus.id,
                createdById: admin.id,
            }
        })
    }

    // active first 10 Cards
    for (let i = 0; i < 10; i++) {
        const card = cards[i];
        await prisma.cardStatus.updateMany({
            where: {
                cardId: card.id,
                isCurrent: true,
            },
            data: {
                isCurrent: false,
            }
        })
        await prisma.cardStatus.create({
            data: {
                cardId: card.id,
                statusId: activeStatus.id,
                createdById: admin.id,
            }
        })
    }

//     exchange rate for card types
    const exchangeRates = []

    for (const item of Object.values(CardType)) {
        const points = faker.number.int({ min: 1200, max: 3000 });
        const amount = faker.number.int({ min: 100, max: 1000 });

        const exchange =await prisma.rechargeExchangeRate.create({
            data: {
                cardType: item,
                points,
                amount,
                isActive: true,
            },
        });
        exchangeRates.push(exchange);
    }



}


main().then(() => {
    console.log("Seeding completed");
    process.exit(0);
})
    .catch((error) => {
        console.error("Error seeding database:", error);
        process.exit(1);
    });
