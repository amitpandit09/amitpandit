var mongoose = require('mongoose');


var userItemsSchema = new mongoose.Schema({
    userId: String,
    item: String,
    rating: String,
    status: String,
    swapItem: String,
    swapItemRating: String,
    swapperRating: String
});

userItemsSchema.statics.getUserItemListFromProfile = function(categories, items, userProfile, userDetails, userItems) {

    var itemList = JSON.parse(items);
    var userItems = JSON.parse(JSON.stringify(userItems));
    var parts = userProfile.userItems.split(",");
    var userProfileList = {
        useritems: []
    };

    for (var i = 0; i < parts.length; i++) {
        userProfileList.useritems.push(parts[i]);
    }

    var userItemList = {
        listOfItems: []
    };
    var itemStatus;
    var itemRating;
    for (var j = 0; j < userProfileList.useritems.length; j++) {

        for (var u = 0; u < userItems.length; u++) {

            if (userProfileList.useritems[j] === userItems[u].item) {
                itemStatus = userItems[u].status;
                itemRating = userItems[u].rating;
            }
        }

        for (var k = 0; k < itemList.length; k++) {
            if (userProfileList.useritems[j] === itemList[k].itemId) {
                for (var c = 0; c < categories.length; c++) {
                    // console.log("chek"+itemList[k].categoryId);
                    if (itemList[k].categoryId === categories[c].categoryId) {

                        userItemList.listOfItems.push({
                            "itemName": itemList[k].itemName,
                            "categoryName": categories[c].categoryName,
                            "rating": itemRating,
                            "status": itemStatus,
                            "itemCode": userProfileList.useritems[j]
                        });
                    } //if close
                    //break;
                } //for close
                break; // outer if break

            } //outer for close

        }
    }

    return userItemList;
}


userItemsSchema.statics.getPendingItemList = function(items,userItems) {

    var itemList = JSON.parse(JSON.stringify(items));
    var userItems = JSON.parse(JSON.stringify(userItems));

    console.log("hurr"+itemList[0].itemId);

    var userItemList = {
        listOfItems: []
    };
    var userItem;
    var swapItem;
    var userItemId;
    var status;
    
    for (var j = 0; j < userItems.length; j++) {

        for (var k = 0; k < itemList.length; k++) {
            if (userItems[j].item === itemList[k].itemId) {

                userItem = itemList[k].itemName;
                userItemId = userItems[j].item;
                status = userItems[j].status;

             }//if 
      }//for k

                for (var c = 0; c < itemList.length; c++) {
                    // console.log("chek"+itemList[k].categoryId);
                    if (userItems[j].swapItem === itemList[c].itemId)  {

                            swapItem = itemList[c].itemName;
                            
                    } //if close
                    
                  } //for close for c
                
     userItemList.listOfItems.push({
                            "userItem": userItem,
                            "swapItem": swapItem,
                            "userItemId":userItemId,
                            "status":status
                        });
    }//for j           
        
    console.log(userItemList);
    return userItemList;
}



userItemsSchema.statics.checkAvailableItem = function checkAvailableItem(userItems, items ,userId) {

        var userItems = JSON.parse(JSON.stringify(userItems));
        var items = JSON.parse(JSON.stringify(items));

        console.log(userItems);
        var userItemList = {
            items: []
        };

        for (var i = 0; i < userItems.length; i++) {
            if (userItems[i].status === "available" && userId != userItems[i].userId) {

                for (var j = 0; j < items.length; j++) {
                    if (userItems[i].item === items[j].itemId ) {
                        userItemList.items.push({"itemName":items[j].itemName,
                                                 "itemId":items[j].itemId});

                        break;
                    }
                }

            } //}
        }

        console.log("hul" + userItemList);
        return userItemList;

    } ///end of func*/

userItemsSchema.statics.checkItemStatus = function checkItemStatus(item, userId) {
    var jsonParsed;
    var jsonData = catalog;
    jsonParsed = JSON.parse(jsonData);

    for (var i = 0; i < jsonParsed.userItem.length; i++) {
        if (jsonParsed.userItem[i].item === item && jsonParsed.userItem[i].userId === userId) {
            return jsonParsed.userItem[i].status;
        }

    }
    return false;
}


module.exports = mongoose.model('useritems', userItemsSchema);