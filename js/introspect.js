var Introspect = {
    get_object: function(class_name) {
        var obj = null;
        try {
            obj = new class_name();
        } catch(e) {
            obj = class_name;
        }
        
        return obj;
    },
    
    typeOf: function (obj) {
        type = typeof obj;
        return type === "object" && !obj ? "null" : type;
    },
    
    exists: function (obj, name, type) {
        type = type || "function";
        return (obj ? this.typeOf(obj[name]) : null) === type;
    },
    
    get_all_variables: function(function_class, function_object) {
        var function_datamembers = {};
        for (prop in function_object) {
            var property_type = Introspect.typeOf(function_object[prop]);
            var property_object = new type_object();
            property_object.name = prop;
            property_object.type = property_type;
            property_object.parent = function_class;
            property_object.value = function_object[prop];
            try {
                function_datamembers[property_type].push(property_object);
            } catch (e) {
                function_datamembers[property_type] = [property_object];
            }
        }
         
        return function_datamembers;
    },    
    
        /**
     Introspects an object.
    
     @param name the object name.
     @param obj the object to introspect.
     @param indent the indentation (optional, defaults to "").
     @param levels the introspection nesting level (defaults to 1).
     @returns a plain text analysis of the object.
    */
    
    introspect_recursive : function (name, obj, indent, levels) {
      indent = indent || "";
      if (this.typeOf(levels) !== "number") levels = 1;
      var objType = this.typeOf(obj);
      var result = [indent, name, " ", objType, " :"].join('');
      if (objType === "object") {
        if (level > 0) {
          indent = [indent, "  "].join('');
          for (prop in obj) {
            var prop = this.introspect(prop, obj[prop], indent, level - 1);
            result = [result, "\n", prop].join('');
          }
          return result;
        }
        else {
          return [result, " ..."].join('');
        }
      }
      else if (objType === "null") {
        return [result, " null"].join('');
      }
      return [result, " ", obj].join('');
    },
    
    introspect: function (name, obj, levels, indent) {
        indent = indent || "";
        if (this.typeOf(levels) != "number") levels = 1;
        var obj_type = this.typeOf(obj);
        var result = [indent, name, " ", obj_type, " :"].join('');
        console.log(obj_type);
        if (obj_type === "object") {
          if (level > 0) {
            indent = [indent, "  "].join('');
            for (prop in obj) {
              console.debug(prop);
              var prop = this.introspect(prop, obj[prop], indent, level - 1);
              result = [result, "\n", prop].join('');
            }
            return result;
          }
          else {
            return [result, " ..."].join('');
          }
        }
        else if (obj_type === "null") {
          return [result, " null"].join('');
        }
        return [result, " ", obj].join('');
    },
    
    introspect_private: function(class_name, match_type_list) {
        var obj_type = this.typeOf(class_name);
        var results = {};
       
        var obj = get_object(class_name);
        
        if (obj_type == "object" || obj_type == "function") {
            for (prop in obj) {
                var property_type = this.typeOf(obj[prop]);
                
                for each(var match_type in match_type_list) {
                    if (property_type == type) {
                        results[prop] = [property_type, obj[prop]];
                    }
                }
            }
        }
        
        return results;        
    },
    
    introspect_functions: function(class_name) {
        var functions = this.introspect_private(class_name, ["function"]);
        
        return functions;
    },
    
    introspect_variables: function(class_name) {
        var variables = this.introspect_private(class_name, ["object", "number", "string", "boolean"]);
        
        return variables;
    }
};
