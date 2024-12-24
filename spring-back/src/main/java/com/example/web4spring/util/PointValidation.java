package com.example.web4spring.util;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.LinkedList;

@Component
public class PointValidation {
    LinkedList<Double> XRList = new LinkedList<>();
    public boolean validate(String dataType, double x, double y, double r){
        if (XRList.size() == 0){
            listFill();
        }
        return checkX(x, dataType) && checkY(y) && checkR(r, dataType);
    }
    private void listFill(){
        XRList.add(-3d);
        XRList.add(-2d);
        XRList.add(-1d);
        XRList.add(0d);
        XRList.add(1d);
        XRList.add(2d);
        XRList.add(3d);
        XRList.add(4d);
        XRList.add(5d);
    }
    private boolean checkX(double X, String dataType){
        if (dataType.equals("click")){
            System.out.println(X);
            return -3 <= X && X <= 5;
        }
        return XRList.contains(X);
    }
    private boolean checkY(double Y){
        return -5 <= Y && Y <= 3;
    }
    private boolean checkR(double R, String dataType){
        if (dataType.equals("click")){
            System.out.println(R);
            return 1 <= R && R <= 5;
        }
        return XRList.contains(R);
    }
}
