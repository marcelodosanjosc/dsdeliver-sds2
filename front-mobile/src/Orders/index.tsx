import React from 'react';
import { StyleSheet, ScrollView} from 'react-native'
import Header from '../Header';
import OrderCard from '../OrderCard';

function Orders(){
    
  
    return (
        <>
        <Header />
        <ScrollView style={styles.container}>
            <OrderCard />
            <OrderCard />
            <OrderCard />
            <OrderCard />
        </ScrollView>
        </>
    );
}


const styles = StyleSheet.create({
  
    container: {
      paddingRight: '5%',
      paddingLeft: '5%'
    },
    button: {
      backgroundColor: '#DA5C5C',
      flexDirection: 'row',
      borderRadius: 10,
      marginTop: 40,
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonText: {
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 50,
      paddingRight: 50,
      fontWeight: 'bold',
      fontSize: 18,
      color: '#FFF',
      letterSpacing: -0.24,
      fontFamily: 'OpenSans_700Bold'
    }
  }
     
)

export default Orders;