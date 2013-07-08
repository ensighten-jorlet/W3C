##W3C Cust Exp Data Layer


### Current State
Basic functionality of publish(), subscribe(), get() & isReady() works <br> <br>
Significant functionality still missing.<br>
<ul><li>Change history is missing</li>
<li>Privacy checks are missing</li>
<li>Chaining is missing</li>
</ul>
===

###Example Usage

```JavaScript

/***** Publish - Usage Examples ******/

dataLayer.publish("someID", "someValue"); //Simplest Addition of Data Value
dataLayer.publish("someID", "someValue", "sensitive @analytics"); //Addition of Data Value with Privacy Policy
dataLayer.publish("someID", "someValue", "@default", "someLayer"); //Addition of Data Value specifying dataLayer

/***** Subscribe - Usage Examples ******/

dataLayer.subscribe("someID", "domain.com", someMethod); //Simplest Subscribe to Data Value
//TBD - If multiple layers, values returned in array or obj

dataLayer.subscribe("someID", "domain.com", someMethod, true); //Subscribe & send previous updates
//TBD - If historic values returned an array/obj or call multiple times

dataLayer.subscribe("someID", "domain.com", someMethod, false, "someLayer"); //Specific Layer

/****** Get - Usage Examples ******/

dataLayer.get("someID", toolDomain); 
//One-time get of value(s) of specified ID from all layers
//TBD - Multiples returned in Array or Obj?

dataLayer.get("someID", toolDomain, "someLayer"); //One-time get of a value from specified layer
```
