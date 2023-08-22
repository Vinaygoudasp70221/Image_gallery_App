import React, { useEffect, useState } from 'react';
import { View, FlatList,Text, Image, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { TouchableOpacity } from 'react-native-gesture-handler';



const HomeScreen = () => {
    const [images, setImages] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [isOffine, setIsOffline] = useState(false);
    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await axios.get("https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s");
            const data = response.data;

            const imageUrls = data.photos.photo.map(photo => photo.url_s);
            setImages(imageUrls);

            // Cache data
            await AsyncStorage.setItem('cachedImages', JSON.stringify(imageUrls));
            setIsOffline(false);

        } catch (error) {
            console.error('You are currenly offline ',);
            setIsOffline(true);

            const cachedImages = await AsyncStorage.getItem('cachedImages');
            if (cachedImages) {
                setImages(JSON.parse(cachedImages));
            }
        }
    };

    const openFullScreenImage = (index) => {
        setSelectedImageIndex(index);
    }

    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.container}>
            {selectedImageIndex !==null ? (
                //display selected images
                <TouchableOpacity style={styles.fullImageContainer} onPress={() => setSelectedImageIndex(null)}>
                    <Image style={{ width: screenWidth, height: screenWidth }} source={{ uri: images[selectedImageIndex] }}></Image>
                </TouchableOpacity>
            ) : (
                <FlatList
                    data={images}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({item, index})=>(
                        <TouchableOpacity onPress={()=> openFullScreenImage(index)}>
                            <Image style={styles.image} source={{uri:item}}></Image>
                        </TouchableOpacity>
                    )}
                    numColumns={3}
                />
            )
            }
            {isOffine && <Text style={styles.offlinetext}>You are currently offline.</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    image: {
        width: 100,
        height: 100,
        margin: 8,
    },
    fullImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    },
    offlinetext: {
        alignSelf: 'center',
        marginTop: 10,
        color: 'red'
    }
});

export default HomeScreen;
