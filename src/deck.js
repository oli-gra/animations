import React, {useState, useEffect} from 'react'
import { View, Animated, PanResponder, Dimensions, StyleSheet, LayoutAnimation, UIManager } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = SCREEN_WIDTH / 4

const deck = ({data,renderCard, renderNoMoreCards, onSwipeRight, onSwipeLeft}) => {

    const [currentCard, setCurrentCard] = useState(0)

    useEffect(() => {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
        LayoutAnimation.spring()
    }, [currentCard])

    const transformCard = () => {
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
            outputRange: ['-80deg', '0deg', '80deg']
        })

        return {
            ...position.getLayout(),
            transform: [{rotate}]
        }
    }
       
    const renderCards = () => {
        if (currentCard > (data.length - 1)) {
            setCurrentCard(0)
        }
        return data.map((item,index) => {
            if (index < currentCard) { return null }
            if (index === currentCard) {
                return <Animated.View 
                    key={item.id}
                    style={[transformCard(), styles.card]} 
                    {...panResponder.panHandlers}
                >
                    {renderCard(item)}
                </Animated.View>
            }

            return <Animated.View 
                style={[styles.card, {top: 11 * (index - currentCard)}]}
                key={item.id}
            >
                {renderCard(item)}
            </Animated.View>
        }).reverse()
    }

    const resetPosition = () => {
        Animated.spring(
            position, 
            {
                toValue: {x: 0, y:0},
                // useNativeDriver: true
            }).start()
    }

    const swipeCard = (direction) => {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
        Animated.timing(position, 
            {
                toValue: {x, y:0},
                duration: 350,
                // useNativeDriver: true
            }).start(() => onSwipeComplete(direction))
    }

    const onSwipeComplete = (direction) => {
        position.setValue({x:0,y:0})
        setCurrentCard(currentCard+1)
        // direction === 'right' ? onSwipeRight() : onSwipeLeft()
    }

    const position = new Animated.ValueXY()

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
            position.setValue({
                x: gesture.dx,
                y: gesture.dy
            })
        },
        onPanResponderRelease: (event, gesture) => {
            if (gesture.dx > SWIPE_THRESHOLD) {
                swipeCard('right')
            } else if (gesture.dx < -SWIPE_THRESHOLD) {
                swipeCard('left')
            } else {
                resetPosition()
            }
        }
    })


    return (
        <View>
            {renderCards()}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        width: SCREEN_WIDTH
    }
})

export default deck
